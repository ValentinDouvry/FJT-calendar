import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hash, compare } from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { ForgetPassword, ForgetPasswordDocument } from './schemas';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    @InjectModel(ForgetPassword.name)
    private readonly ForgetPasswordModel: Model<ForgetPasswordDocument>,
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.UserModel.updateOne({ _id: id }, { updateUserDto });
  }

  async remove(id: string) {
    return this.UserModel.updateOne(
      { _id: id },
      {
        $unset: {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          room_number: '',
          avatar_path: '',
          status: '',
        },
        is_deleted: true,
        deleted_date: new Date(),
      },
    );
  }

  async changePassword(userId: string, passwordDto: ChangePasswordDto) {
    if (!isValidObjectId(userId)) {
      throw new HttpException('Utilisateur incorrect', HttpStatus.CONFLICT);
    }

    if (passwordDto.new_password !== passwordDto.confirm_password) {
      throw new HttpException(
        'les mots de passe ne sont pas identique',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const user = await this.findOne(userId);
    if (!user) {
      throw new HttpException('Utilisateur inexistant', HttpStatus.NOT_FOUND);
    }

    if (!(await compare(passwordDto.old_password, user.password))) {
      throw new HttpException(
        'Mot de password incorrect',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return this.UserModel.updateOne(
      { _id: userId },
      { password: await hash(passwordDto.new_password, 10) },
    );
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.findOneByEmail(forgetPasswordDto.email);

    if (!user) {
      throw new HttpException('Utilisateur innexistant', HttpStatus.NOT_FOUND);
    }

    const codeReset = uuidv4();

    const resetPassaword = {
      user_id: user._id,
      code_reset: codeReset,
      is_used: false,
      create_date: new Date(),
    };

    const forgetPass = await new this.ForgetPasswordModel(
      resetPassaword,
    ).save();

    return forgetPass;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.new_password !== resetPasswordDto.confirm_password) {
      throw new HttpException(
        'les mots de passe ne sont pas identique',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const resetPass = await this.ForgetPasswordModel.findOne({
      code_reset: resetPasswordDto.code_reset,
    });

    if (!resetPass) {
      throw new HttpException('code non valide', HttpStatus.NOT_FOUND);
    }

    if (resetPass.is_used) {
      throw new HttpException(
        'le reset code déjà utilisé',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const result = await this.UserModel.updateOne(
      { _id: resetPass.user_id },
      { password: await hash(resetPasswordDto.new_password, 10) },
    );

    if (result.acknowledged === true) {
      return this.ForgetPasswordModel.updateOne(
        { _id: resetPass._id },
        { is_used: true },
      );
    }
  }
}
