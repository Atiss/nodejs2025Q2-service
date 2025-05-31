import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  artistId?: string | null;
  albumId?: string | null;
  @IsNotEmpty()
  @IsInt()
  duration: number;
}
