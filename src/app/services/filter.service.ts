import { Injectable, signal, computed } from '@angular/core';

import { User } from '@models/user.model';
import { TableColumn } from '@models/user-table.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private state = signal({
    loading: false,
    searchTerm: '',
    users: [] as User[],
    filteredUsers: [] as User[],
    visibleColumns: {
      name: true,
      email: true,
      company: true,
      age: true,
      balance: true,
      isActive: true,
    } as Record<string, boolean>
  });

  readonly loading = computed(() => this.state().loading);
  readonly searchTerm = computed(() => this.state().searchTerm);
  readonly displayedColumns = computed(() => 
    Object.entries(this.state().visibleColumns)
      .filter(([_, isVisible]) => isVisible)
      .map(([column]) => column)
  );
  readonly visibleColumns = computed(() => this.state().visibleColumns);
  readonly filteredUsers = computed(() => this.state().filteredUsers);

  setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, loading }));
  }

  setSearchTerm(searchTerm: string) {
    this.state.update(state => {
      const filteredUsers = this.filterUsers(state.users, searchTerm);
      return { ...state, searchTerm, filteredUsers };
    });
  }

  setUsers(users: User[]) {
    this.state.update(state => {
      const filteredUsers = this.filterUsers(users, state.searchTerm);
      return { ...state, users, filteredUsers };
    });
  }

  toggleColumn(column: TableColumn, value: boolean) {
    this.state.update(state => ({
      ...state,
      visibleColumns: { ...state.visibleColumns, [column]: value }
    }));
  }

  private filterUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm) return users;
    
    const search = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name?.first?.toLowerCase().includes(search) ||
      user.name?.last?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.company?.toLowerCase().includes(search)
    );
  }
} 