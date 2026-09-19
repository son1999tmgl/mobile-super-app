/**
 * HttpFilterBuilder (Chuẩn Bruno / DevExtreme / Laravel Query Builder)
 * Dùng chung cho toàn bộ các hệ sinh thái và Mini-Apps của IntrustDSS
 * Định dạng params theo chuẩn Web inTrace:
 * - filter_groups[groupIndex][filters][filterIndex][key]=...
 * - filter_groups[groupIndex][filters][filterIndex][value]=...
 * - filter_groups[groupIndex][filters][filterIndex][operator]=eq|ct|gte|lt|in
 * - sort[sortIndex][key]=...&sort[sortIndex][direction]=ASC|DESC
 * - includes[]=...
 * - limit=...&page=...
 */

export interface ApiFilterItem {
  key: string;
  value: any;
  operator?: string;
}

export class HttpFilterBuilder {
  private _params: string[] = [];
  private _groupIndex = 5555;
  private _sortIndex = 0;

  constructor(initialGroupIndex = 5555) {
    this._groupIndex = initialGroupIndex;
  }

  /**
   * Thêm 1 điều kiện lọc đơn lẻ
   * @param key Tên trường (vd: product_category_config_id, status, created_at)
   * @param value Giá trị lọc
   * @param operator Toán tử so sánh: 'eq' (mặc định), 'ct' (chứa), 'gte', 'lt', 'in'
   */
  append(key: string, value: any, operator: string = 'eq'): HttpFilterBuilder {
    if (value === undefined || value === null || value === '' || value === 'ALL') {
      return this;
    }

    this._params.push(`filter_groups[${this._groupIndex}][filters][0][key]=${encodeURIComponent(key)}`);

    if (operator === 'in' && Array.isArray(value)) {
      value.forEach((v, i) => {
        this._params.push(
          `filter_groups[${this._groupIndex}][filters][0][value][${i}]=${encodeURIComponent(String(v))}`
        );
      });
    } else {
      this._params.push(
        `filter_groups[${this._groupIndex}][filters][0][value]=${encodeURIComponent(String(value))}`
      );
    }

    this._params.push(`filter_groups[${this._groupIndex}][filters][0][operator]=${operator}`);
    this._groupIndex++;
    return this;
  }

  /**
   * Thêm 1 nhóm điều kiện lọc (có hỗ trợ OR giữa các điều kiện trong cùng nhóm)
   */
  appendGroup(filters: ApiFilterItem[], or: boolean = false): HttpFilterBuilder {
    const validFilters = filters.filter(
      (f) => f.value !== undefined && f.value !== null && f.value !== '' && f.value !== 'ALL'
    );
    if (validFilters.length === 0) {
      return this;
    }

    if (or) {
      this._params.push(`filter_groups[${this._groupIndex}][or]=true`);
    }

    validFilters.forEach((filter, index) => {
      const operator = filter.operator || 'eq';
      this._params.push(
        `filter_groups[${this._groupIndex}][filters][${index}][key]=${encodeURIComponent(filter.key)}`
      );

      if (operator === 'in' && Array.isArray(filter.value)) {
        filter.value.forEach((v, i) => {
          this._params.push(
            `filter_groups[${this._groupIndex}][filters][${index}][value][${i}]=${encodeURIComponent(String(v))}`
          );
        });
      } else {
        this._params.push(
          `filter_groups[${this._groupIndex}][filters][${index}][value]=${encodeURIComponent(String(filter.value))}`
        );
      }

      this._params.push(
        `filter_groups[${this._groupIndex}][filters][${index}][operator]=${operator}`
      );
    });

    this._groupIndex++;
    return this;
  }

  /**
   * Thiết lập sắp xếp (Sort)
   */
  addSort(key: string, direction: 'ASC' | 'DESC' = 'DESC', index?: number): HttpFilterBuilder {
    const sortIdx = index !== undefined ? index : this._sortIndex++;
    this._params.push(`sort[${sortIdx}][key]=${encodeURIComponent(key)}&sort[${sortIdx}][direction]=${direction}`);
    return this;
  }

  /**
   * Thêm quan hệ đính kèm (Includes)
   */
  addInclude(relation: string): HttpFilterBuilder {
    this._params.push(`includes[]=${encodeURIComponent(relation)}`);
    return this;
  }

  /**
   * Thiết lập phân trang
   */
  setPagination(limit: number = 50, page: number = 1): HttpFilterBuilder {
    this._params.unshift(`limit=${limit}&page=${page}`);
    return this;
  }

  /**
   * Xuất query string hoàn chỉnh
   */
  build(): string {
    return this._params.join('&');
  }

  /**
   * Tạo full URL từ base URL và endpoint
   */
  buildUrl(endpointUrl: string): string {
    const query = this.build();
    if (!query) return endpointUrl;
    const separator = endpointUrl.includes('?') ? '&' : '?';
    return `${endpointUrl}${separator}${query}`;
  }
}
