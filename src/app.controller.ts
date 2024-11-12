import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

interface Score {
  username: string;
  difficulty: string;
  time: number;
}

const scores: Score[] = [];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'cursor test';
  }

  @Post('scores')
  saveScore(@Body() body: Score): { message: string; data: Score } {
    const { username, difficulty, time } = body;
    if (!username || !difficulty || typeof time !== 'number') {
      throw new HttpException('요청 데이터가 유효하지 않습니다.', HttpStatus.BAD_REQUEST);
    }
    scores.push({ username, difficulty, time });
    return {
      message: '기록이 성공적으로 저장되었습니다.',
      data: { username, difficulty, time },
    };
  }

  @Get('rankings/:difficulty')
  getRankings(@Param('difficulty') difficulty: string): { difficulty: string; rankings: Score[] } {
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      throw new HttpException('유효하지 않은 난이도입니다. (easy, medium, hard 중 선택)', HttpStatus.BAD_REQUEST);
    }
    const rankings = scores
      .filter(score => score.difficulty === difficulty)
      .sort((a, b) => a.time - b.time)
      .slice(0, 5)
      .map((score, index) => ({ rank: index + 1, ...score }));

    if (rankings.length === 0) {
      throw new HttpException('해당 난이도의 랭킹 정보가 없습니다.', HttpStatus.NOT_FOUND);
    }

    return { difficulty, rankings };
  }
}
