import { Injectable, UnsupportedMediaTypeException } from "@nestjs/common";
import {
    MulterModuleOptions,
    MulterOptionsFactory,
} from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";
import path, { join } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    private getRootPath(): string {
        return process.cwd();
    }

    private ensureExists(targetDirectory: string): void {
        try {
            fs.mkdirSync(targetDirectory, {
                recursive: true,
            });
        } catch (error) {
            console.error(
                `Failed to create directory: ${targetDirectory}`,
                error,
            );
            throw error;
        }
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            limits: {
                fileSize: 1024 * 1024, // 1MB
            },

            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "text/plain",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];

                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new UnsupportedMediaTypeException(
                            "File type is not allowed",
                        ),
                        false,
                    );
                }

                cb(null, true);
            },

            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder =
                        (req.headers.folder_type as string) ||
                        "default";

                    const uploadPath = join(
                        this.getRootPath(),
                        "public",
                        "images",
                        folder,
                    );

                    this.ensureExists(uploadPath);

                    cb(null, uploadPath);
                },

                filename: (req, file, cb) => {
                    const extName = path.extname(
                        file.originalname,
                    );

                    const baseName = path.basename(
                        file.originalname,
                        extName,
                    );

                    const sanitizedBaseName = baseName
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/[^a-zA-Z0-9-_]/g, "");

                    const finalName = `${sanitizedBaseName}-${Date.now()}${extName}`;

                    cb(null, finalName);
                },
            }),
        };
    }
}