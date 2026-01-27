import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async updateStock(reference: string, quantity: number) {
    return this.prisma.piecesRechange.update({
      where: { reference },
      data: { 
        stock: quantity,
        quantiteStock: quantity 
      }
    });
  }

  async decrementStock(reference: string, amount: number = 1) {
    const piece = await this.prisma.piecesRechange.findUnique({
      where: { reference }
    });
    
    if (!piece) throw new Error('Piece not found');
    
    const newStock = Math.max(0, piece.stock - amount);
    
    return this.prisma.piecesRechange.update({
      where: { reference },
      data: { 
        stock: newStock,
        quantiteStock: newStock 
      }
    });
  }

  async getStockStatus(reference: string) {
    const piece = await this.prisma.piecesRechange.findUnique({
      where: { reference },
      select: { reference: true, designation: true, stock: true, quantiteStock: true }
    });
    
    return piece;
  }
}
