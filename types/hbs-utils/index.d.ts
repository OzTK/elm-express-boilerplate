import * as hbs from "../hbs"

declare namespace hbsUtils {
  export interface HbsUtils {
      registerWatchedPartials(path: any): void;
  }
}

declare function hbsUtils(hbs: hbs.HBS): hbsUtils.HbsUtils;

export = hbsUtils;