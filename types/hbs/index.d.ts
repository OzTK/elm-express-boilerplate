export = hbs;

declare let hbs: hbs.HBS;

declare namespace hbs {
    interface HBS {
        hbs(handlebars: any): any;
        localsAsTemplateData(app: any): void;
        registerHelper(name: string, helper: Function): void;
    }
}