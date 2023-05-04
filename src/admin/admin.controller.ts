import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { CreateDesignIdeaCategoryDto } from './dto/create-design-idea-category.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateDesignIdeaCategoryDto } from './dto/update-design-idea-category.dto';
import { CreateDesignIdeasProjectDto } from './dto/create-design-idea-project.dto';
import { UpdateDesignIdeaProjectDto } from './dto/update-design-idea-project.dto';
import { DeleteDesignIdeaProjectImageDto } from './dto/delete-design-idea-project-image.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //==Categories==//

  // GET (ALL)
  @Get('/all-design-ideas-categories')
  getAllDesignIdeasCategories() {
    return this.adminService.getAllDesignIdeasCategories();
  }

  // ADD
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/add-design-ideas-category')
  addDesignIdeasCategories(
    @Body() addDesignIdeaCategoryDto: CreateDesignIdeaCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addDesignIdeasCategory(
      addDesignIdeaCategoryDto,
      image,
    );
  }

  // UPDATE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/update-design-ideas-category/:categoryId')
  updateDesignIdeasCategories(
    @Body() updateDesignIdeaCategoryDto: UpdateDesignIdeaCategoryDto,
    @UploadedFile() image: any,
    @Param('categoryId') categoryId: number,
  ) {
    return this.adminService.updateDesignIdeasCategory(
      updateDesignIdeaCategoryDto,
      image,
      categoryId,
    );
  }

  // DELETE
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Delete('/delete-design-ideas-category/:categoryId')
  deleteDesignIdeasCategories(@Param('categoryId') categoryId: number) {
    return this.adminService.deleteDesignIdeaCategory(categoryId);
  }

  //==Projects==//

  // GET (All By category ID)
  @Get('/all-design-ideas-project-by-category/:categoryId')
  getAllDesignIdeasProjectsByCategoryId(
    @Param('categoryId') categoryId: number,
  ) {
    return this.adminService.getAllDesignIdeasProjectsByCategoryId(categoryId);
  }

  // ADD
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/add-design-ideas-project/:categoryId')
  addDesignIdeasProjectByCategoryId(
    @Body() createDesignIdeasProjectDto: CreateDesignIdeasProjectDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('categoryId') categoryId: number,
  ) {
    return this.adminService.addDesignIdeasProjectByCategoryId(
      createDesignIdeasProjectDto,
      images,
      categoryId,
    );
  }

  // GET (By ID)
  @Get('/design-ideas-project/:id')
  getDesignIdeasProjectById(@Param('id') id: number) {
    return this.adminService.getDesignIdeaProjectById(id);
  }

  // UPDATE (By ID)
  @UseGuards(AdminAuthGuard)
  @Patch('/update-design-ideas-project/:id')
  updateDesignIdeasProjectById(
    @Body() updateDesignIdeaProjecDto: UpdateDesignIdeaProjectDto,
    @Param('id') id: number,
  ) {
    return this.adminService.updateDesignIdeaProjectById(
      updateDesignIdeaProjecDto,
      id,
    );
  }

  // DELETE PROJECT IMAGE (By Project ID)
  @UseGuards(AdminAuthGuard)
  @Delete('/delete-design-idea-project-image/:id')
  deleteDesignIdeasProjectImageById(
    @Body() deleteDesignIdeaProjectImageDto: DeleteDesignIdeaProjectImageDto,
    @Param('id') id: number,
  ) {
    return this.adminService.deleteDesignIdeaProjectImage(
      id,
      deleteDesignIdeaProjectImageDto.url,
    );
  }

  // DELETE PROJECT (By ID)
  @UseGuards(AdminAuthGuard)
  @Delete('/delete-design-idea-project/:id')
  deleteDesignIdeasProjectById(@Param('id') id: number) {
    return this.adminService.deleteDesignIdeaProject(id);
  }
}
