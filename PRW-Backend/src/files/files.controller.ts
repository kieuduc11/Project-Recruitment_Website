import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseMessage } from "src/decorators/customize";

@Controller("files")
export class FilesController {
    @Post("upload")
    @ResponseMessage("Upload a file")
    @UseInterceptors(FileInterceptor("fileUpload"))
    uploadFile(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return {
            fileName: file.filename,
        };
    }
}