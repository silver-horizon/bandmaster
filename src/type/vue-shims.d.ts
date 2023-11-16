export {};

declare module "vue" {
    interface ComponentCustomProperties {
        $window: Window
    }
}