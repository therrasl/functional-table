import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '@models/user.model';
import { TableColumn } from '@models/user-table.model';
import { FilterService } from '@services/filter.service';
import { SortService } from '@services/sort.service';
import { PaginationService } from '@services/pagination.service';
import { UserService } from '@services/user.service';
import { computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableComponent implements OnInit {
  private readonly filter = inject(FilterService);
  private readonly sort = inject(SortService);
  private readonly pagination = inject(PaginationService);
  private readonly userService = inject(UserService);

  readonly searchTerm = this.filter.searchTerm;
  readonly loading = this.filter.loading;
  readonly pageSize = this.pagination.pageSize;
  readonly currentPage = this.pagination.currentPage;
  readonly sortColumn = this.sort.sortColumn;
  readonly sortDirection = this.sort.sortDirection;

  readonly visibleColumns = computed(
    () => this.filter.visibleColumns() as Record<string, boolean>
  );
  readonly displayedColumns = computed(() => this.filter.displayedColumns());
  readonly filteredUsers = computed(() => this.filter.filteredUsers());
  readonly paginatedUsers = computed(() => this.pagination.paginatedUsers());

  ngOnInit() {
    this.filter.setLoading(true);
    this.userService.getUsers().then((users: User[]) => {
      this.filter.setUsers(users);
      this.pagination.setUsers(users);
      this.filter.setLoading(false);
    });
  }

  onSearch(term: string) {
    this.filter.setSearchTerm(term);
    this.pagination.setPage(1);
    this.updatePaginatedData();
  }

  onPageChange(event: PageEvent) {
    this.pagination.setPage(event.pageIndex + 1);
    this.pagination.setPageSize(event.pageSize);
  }

  onColumnToggle(column: string, value: boolean) {
    this.filter.toggleColumn(column as TableColumn, value);
  }

  onSort(column: string) {
    this.sort.sort(column as keyof User | '');
    this.updatePaginatedData();
  }

  private updatePaginatedData() {
    const sortedUsers = this.sort.sortUsers(this.filter.filteredUsers());
    this.pagination.setUsers(sortedUsers);
  }

  onPageSizeChange(size: number) {
    this.pagination.setPageSize(size);
  }
}
