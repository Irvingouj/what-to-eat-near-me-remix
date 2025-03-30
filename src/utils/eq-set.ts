export class EqSet<T> {
    private items: T[] = [];
    constructor(private equalsFn: (a: T, b: T) => boolean, items: T[] = []) {
        this.items = items;
    }

    static fromSet<T>(set: Set<T>, equalsFn: (a: T, b: T) => boolean): EqSet<T> {
        return new EqSet<T>(equalsFn, Array.from(set));
    }

    static fromArray<T>(array: T[], equalsFn: (a: T, b: T) => boolean): EqSet<T> {
        return new EqSet<T>(equalsFn, array);
    }

    add(value: T): void {
        const existing = this.items.find(item => this.equalsFn(item, value));
        if (!existing) this.items.push(value);
    }

    get(value: T): T | undefined {
        return this.items.find(item => this.equalsFn(item, value));
    }

    apply(value: T) {
        return {
            ifValue: (fn: (value: T) => void) => {
                if (this.has(value)) {
                    fn(value);
                }
            },
        }
    }

    has(value: T): boolean {
        return this.get(value) !== undefined;
    }

    delete(value: T): boolean {
        const idx = this.items.findIndex(item => this.equalsFn(item, value));
        if (idx !== -1) {
            this.items.splice(idx, 1);
            return true;
        }
        return false;
    }

    toArray(): T[] {
        return [...this.items];
    }

    get size(): number {
        return this.items.length;
    }

    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
}
