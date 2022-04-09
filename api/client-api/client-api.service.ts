export class ClientApiService {
  generateCode(): number {
    return 100000 + Math.random() * 900000;
  }
}