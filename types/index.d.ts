// declare module '*.png'

// declare module '*.svg'

// declare module 'nprogress'

// declare module 'inquirer'

// declare module 'fs-extra'

// declare module 'jsencrypt'

// declare module 'sortablejs'

declare type Nullable<T> = T | null;

declare type Recordable<T = any> = Record<string, T>;

declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type RefType<T> = T | null

declare type EmitType = (event: any, ...args: any[]) => void

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type TimeoutHandle = ReturnType<typeof setTimeout>

declare type IntervalHandle = ReturnType<typeof setInterval>

declare type LabelValueOptions = {
  label: string;
  value: any;
  [key: string]: string | number | boolean;
}[];

declare interface ChangeEvent extends Event {
  target: HTMLInputElement;
}

// declare type PageWrap<T> =
declare interface PageDataWrap<T> {
  rows: T[]
  total: number
}

declare interface IFileItem {
  fileCode: string
  fileName: string
  tableName: string
  objectId: string
  fileFormat: string
  fileType: string
  fileUrl: string
  fileTime: string
  userCode: string
}
