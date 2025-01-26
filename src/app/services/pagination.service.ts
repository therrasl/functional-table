import { Injectable, signal, computed } from '@angular/core';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private state = signal({
    pageSize: 10,
    currentPage: 1,
    users: [] as User[]
  });

  readonly pageSize = computed(() => this.state().pageSize);
  readonly currentPage = computed(() => this.state().currentPage);
  readonly paginatedUsers = computed(() => {
    const start = (this.state().currentPage - 1) * this.state().pageSize;
    return this.state().users.slice(start, start + this.state().pageSize);
  });

  setPage(page: number) {
    this.state.update(state => ({ ...state, currentPage: page }));
  }

  setPageSize(size: number) {
    this.state.update(state => ({ ...state, pageSize: size }));
  }

  setUsers(users: User[]) {
    this.state.update(state => ({ ...state, users }));
  }
} 