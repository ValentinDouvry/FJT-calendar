import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.email);
    if (userExist) {
      throw new HttpException(
        'Cette email est déjà utilisé',
        HttpStatus.CONFLICT,
      );
    }

    createUserDto.password = await hash(createUserDto.password, 10);

    const createdUser = new this.UserModel(createUserDto);
    await createdUser.save();
    const sanitized = createdUser.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findAll(): Promise<User[]> {
    const allUser = await this.UserModel.find().exec();
    return allUser;
  }

  async findOne(id: string) {
    return this.UserModel.find({ _id: id }).exec();
  }

  async findOneByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
