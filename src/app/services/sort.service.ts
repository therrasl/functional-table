import { Injectable, signal, computed } from '@angular/core';

import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  private state = signal({
    sortColumn: '' as keyof User | '',
    sortDirection: 'asc' as 'asc' | 'desc'
  });

  readonly sortColumn = computed(() => this.state().sortColumn);
  readonly sortDirection = computed(() => this.state().sortDirection);

  sort(column: keyof User | '') {
    this.state.update(state => ({
      ...state,
      sortColumn: column,
      sortDirection: state.sortColumn === column && state.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  }

  sortUsers(users: User[]): User[] {
    const { sortColumn, sortDirection } = this.state();
    if (!sortColumn) return users;

    return [...users].sort((a, b) => {
      const aValue = this.getSortValue(a, sortColumn);
      const bValue = this.getSortValue(b, sortColumn);
      return (aValue > bValue ? 1 : -1) * (sortDirection === 'asc' ? 1 : -1);
    });
  }

  private getSortValue(user: User, column: keyof User | ''): any {
    if (column === 'name') {
      return `${user.name?.last} ${user.name?.first}`;
    }
    return user[column as keyof User];
  }
} 