import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      const validTypes = [
        'image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif',
        'image/bmp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif',
        'application/pdf' // Support PDF for scanned documents
      ];
      
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Format non supporté. Utilisez PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG, HEIC, PDF'), false);
      }
    },
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB max for high-quality scans
    },
  }))
  async verifyCarteGrise(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier téléchargé');
    }

    // Additional validation
    if (file.size === 0) {
      throw new BadRequestException('Le fichier est vide');
    }

    // Check if file is corrupted by trying to read first few bytes
    if (file.buffer && file.buffer.length < 100) {
      throw new BadRequestException('Le fichier semble être corrompu');
    }
    
    // Vérifier que l'image n'est pas trop petite (probablement illisible)
    if (file.mimetype !== 'application/pdf' && file.size < 10 * 1024) { // 10KB minimum for images
      throw new BadRequestException('L\'image est trop petite. Utilisez une image de meilleure qualité.');
    }

    try {
      const result = await this.verificationService.verifyDocument(file);
      return result;
    } catch (error) {
      console.error('Verification error:', error);
      throw new BadRequestException('Erreur lors de la vérification du document');
    }
  }
}
