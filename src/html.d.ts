export {};

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    command?: "show-modal";
    commandfor?: string;
  }
}
