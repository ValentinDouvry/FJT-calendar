import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hash } from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async create(registerDto: RegisterDto): Promise<any> {
    if (registerDto.password !== registerDto.confirme_password) {
      throw new HttpException(
        'Les mots de passe ne sont pas identique',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const { confirme_password, ...newUser } = registerDto;

    const user = await this.findOneByEmail(newUser.email);
    if (user) {
      throw new HttpException(
        'Cette email est déjà utilisé',
        HttpStatus.CONFLICT,
      );
    }

    newUser.password = await hash(newUser.password, 10);

    const createdUser = await new this.UserModel(newUser).save();

    const userInfo = createdUser.toObject();
    delete userInfo['password'];

    return userInfo;
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.UserModel.findOne({ _id: id });
  }

  async findOneByEmail(email: string): Promise<any> {
    return this.UserModel.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
