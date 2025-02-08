
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  birthDate: Date;
  role: 'participant' | 'collector';
}
