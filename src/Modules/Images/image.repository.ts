import imageModel from './image.model';
import { BaseRepository } from '../../Repository';

/**
 * Repository class for interacting with the image collection in the database.
 */
class ImageRepository extends BaseRepository<any> {
  constructor() {
    super(imageModel);
  }
}

export default new ImageRepository();
