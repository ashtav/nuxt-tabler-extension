interface Column {
    key?: string,
    label: string,
    sortable?: boolean
}

interface TablePagination {
    client?: boolean;
    meta?: Meta;
    length?: number;
    paginate?: (page: number) => void;
}

interface TableEntries {
    entries?: Array<number>;
    entry?: (value: number) => void;
}

interface Meta {
    current_page: number,
    last_page: number,
    from: number,
    to: number,
    total: number
}