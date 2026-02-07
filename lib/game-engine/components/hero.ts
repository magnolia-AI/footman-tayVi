import { Component } from '../core';

export class LevelComponent extends Component {
  readonly type = 'level';
  constructor(
    public level: number = 1,
    public experience: number = 0,
    public experienceToNext: number = 100
  ) {
    super();
  }
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export class InventoryComponent extends Component {
  readonly type = 'inventory';
  public slots: (InventoryItem | null)[] = new Array(6).fill(null);

  constructor() {
    super();
  }

  addItem(item: InventoryItem): boolean {
    const emptySlot = this.slots.findIndex(slot => slot === null);
    if (emptySlot !== -1) {
      this.slots[emptySlot] = item;
      return true;
    }
    return false;
  }
}
