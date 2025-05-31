import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  artistId?: string | null;
  @IsOptional()
  albumId?: string | null;
  @IsNotEmpty()
  @IsInt()
  duration: number;
}
