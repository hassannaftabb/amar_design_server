import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DesignIdeaCategory } from './entities/design-idea-category.entity';
import { Repository } from 'typeorm';
import { DesignIdeaProject } from './entities/design-idea-project,entity';
import { CreateDesignIdeaCategoryDto } from './dto/create-design-idea-category.dto';
import { S3Service } from 'src/s3/s3.service';
import { UpdateDesignIdeaCategoryDto } from './dto/update-design-idea-category.dto';
import { CreateDesignIdeasProjectDto } from './dto/create-design-idea-project.dto';
import { UpdateDesignIdeaProjectDto } from './dto/update-design-idea-project.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(DesignIdeaCategory)
    private readonly designIdeaCategoryRepository: Repository<DesignIdeaCategory>,
    @InjectRepository(DesignIdeaProject)
    private readonly designIdeaProjectsRepository: Repository<DesignIdeaProject>,
    private s3Service: S3Service,
  ) {}

  //==Categories==//

  async getAllDesignIdeasCategories() {
    const allCategories = await this.designIdeaCategoryRepository.find();
    console.log(allCategories);
    const promises = allCategories.map(async (category: DesignIdeaCategory) => {
      const categoryId = category.id;
      const allProjectsWithCategoryId =
        await this.designIdeaProjectsRepository.find({
          where: {
            category: {
              id: categoryId,
            },
          },
        });
      return {
        ...category,
        totalProjects: allProjectsWithCategoryId.length,
      };
    });
    const designIdeaCategoriesWithTotalProjects = await Promise.all(promises);
    return designIdeaCategoriesWithTotalProjects;
  }

  async addDesignIdeasCategory(
    createDesignIdeaCategoryDto: CreateDesignIdeaCategoryDto,
    image: Express.Multer.File,
  ) {
    const bucketKey = `${image.originalname}-${Date.now()}`;
    const imageUrl = await this.s3Service.uploadFile(image, bucketKey);
    const category = {
      title: createDesignIdeaCategoryDto.title,
      image: imageUrl,
    };

    const createdCategory = this.designIdeaCategoryRepository.create(category);
    return await this.designIdeaCategoryRepository.save(createdCategory);
  }

  async updateDesignIdeasCategory(
    updateDesignIdeaCategoryDto: UpdateDesignIdeaCategoryDto,
    image: Express.Multer.File,
    categoryId: number,
  ) {
    let imageUrl = '';
    if (image) {
      const bucketKey = `${image.originalname}-${Date.now()}`;
      imageUrl = await this.s3Service.uploadFile(image, bucketKey);
    }
    const category = {
      title: updateDesignIdeaCategoryDto.title,
      ...(imageUrl && { image: imageUrl }),
    };

    await this.designIdeaCategoryRepository
      .update({ id: categoryId }, category)
      .then(async () => {
        const updatedProject = await this.designIdeaCategoryRepository.findOne({
          where: {
            id: categoryId,
          },
        });
        return updatedProject;
      })
      .catch((err) => {
        throw new BadRequestException(
          `An error occured while updating category: ${err}`,
        );
      });
  }

  async deleteDesignIdeaCategory(categoryId: number) {
    await this.designIdeaCategoryRepository
      .delete({
        id: categoryId,
      })
      .then(() => {
        return { message: 'Category deleted successfully', success: true };
      })
      .catch((err) => {
        throw new BadRequestException(
          `An error occured while deleting category: ${err}`,
        );
      });
  }

  //==Projects==//
  getAllDesignIdeasProjectsByCategoryId(categoryId: number) {
    return this.designIdeaProjectsRepository.findBy({
      category: { id: categoryId },
    });
  }

  async addDesignIdeasProjectByCategoryId(
    createDesignIdeasProjectDto: CreateDesignIdeasProjectDto,
    images: Express.Multer.File[],
    categoryId: number,
  ) {
    const category = await this.designIdeaCategoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    const imgUrls = await Promise.all(
      images.map(async (img: Express.Multer.File) => {
        const bucketKey = `${img.fieldname}${Date.now()}`;
        const uploadResponse = await this.s3Service.uploadFile(img, bucketKey);
        return uploadResponse;
      }),
    );
    const project = {
      title: createDesignIdeasProjectDto.title,
      category: category,
      description: createDesignIdeasProjectDto.description,
      sizeOrDimensions: createDesignIdeasProjectDto.sizeOrDimensions,
      images: imgUrls,
    };
    const createdProject = this.designIdeaProjectsRepository.create(project);
    return await this.designIdeaProjectsRepository.save(createdProject);
  }

  async getDesignIdeaProjectById(id: number) {
    const project = await this.designIdeaProjectsRepository.findOneBy({
      id: id,
    });
    if (project) {
      return project;
    } else {
      throw new NotFoundException('No project with this ID.');
    }
  }

  async updateDesignIdeaProjectById(
    updateDesignIdeaProjectDto: UpdateDesignIdeaProjectDto,
    id: number,
  ) {
    const project = {
      title: updateDesignIdeaProjectDto.title,
      description: updateDesignIdeaProjectDto.description,
      sizeOrDimensions: updateDesignIdeaProjectDto.sizeOrDimensions,
    };
    await this.designIdeaProjectsRepository
      .update({ id: id }, project)
      .then(async () => {
        const updatesProject =
          await this.designIdeaProjectsRepository.findOneBy({ id: id });
        return updatesProject;
      })
      .catch((err) => {
        throw new BadRequestException(
          `An error occured while deleting category: ${err}`,
        );
      });
  }

  async deleteDesignIdeaProjectImage(projectId: number, imageUrl: string) {
    const project = await this.designIdeaProjectsRepository.findOneBy({
      id: projectId,
    });
    if (!project) {
      throw new NotFoundException('No project with this ID.');
    }
    const imageIndex = project.images.findIndex((url) => url === imageUrl);
    if (imageIndex !== -1) {
      project.images.splice(imageIndex, 1);
      await this.designIdeaCategoryRepository.save(project);
      const updatedproject = await this.designIdeaProjectsRepository.findOneBy({
        id: projectId,
      });
      return updatedproject;
    } else {
      throw new NotFoundException('Image URL not found');
    }
  }
  async deleteDesignIdeaProject(projectId: number) {
    const project = await this.designIdeaProjectsRepository.findOneBy({
      id: projectId,
    });
    if (!project) {
      throw new NotFoundException('No project with this ID.');
    }
    await this.designIdeaProjectsRepository
      .delete({ id: projectId })
      .then(() => {
        return { message: 'Project deleted', success: true };
      })
      .catch((err) => {
        throw new BadRequestException(`An error deleting project: ${err}`);
      });
  }
}
