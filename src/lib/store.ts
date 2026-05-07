import { User, Transaction } from '../types';

const USER_KEY = 'kinetic_user';
const HISTORY_KEY = 'kinetic_history';

export const store = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },
  getHistory: (): Transaction[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },
  addTransaction: (tx: Transaction) => {
    const history = store.getHistory();
    localStorage.setItem(HISTORY_KEY, JSON.stringify([tx, ...history]));
  }
};
