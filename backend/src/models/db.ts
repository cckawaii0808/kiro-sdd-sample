// 簡易記憶體資料庫（示範用）
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

export interface Calculation {
  id: string;
  userId: string;
  expression: string;
  result: number;
  createdAt: Date;
}

class MemoryDB {
  private users: Map<string, User> = new Map();
  private calculations: Map<string, Calculation> = new Map();

  // User operations
  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Calculation operations
  createCalculation(calc: Calculation): Calculation {
    this.calculations.set(calc.id, calc);
    return calc;
  }

  findCalculationsByUserId(userId: string, limit: number = 10): Calculation[] {
    return Array.from(this.calculations.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  deleteCalculationsByUserId(userId: string): void {
    Array.from(this.calculations.entries())
      .filter(([_, calc]) => calc.userId === userId)
      .forEach(([id]) => this.calculations.delete(id));
  }

  // 測試用：清除所有資料
  clear(): void {
    this.users.clear();
    this.calculations.clear();
  }
}

export const db = new MemoryDB();
