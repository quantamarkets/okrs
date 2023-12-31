export interface IExtra {
  [key: string]: any;
  status?: number;
  issues?: Array<{
    message: string;
    path: Array<string | number>;
  }>;
}

export class Fail<L extends string = string> extends Error {
  public readonly success = false;
  public readonly value = null;
  public readonly _kr = 'fail';
  public readonly status: number;

  constructor(
    public readonly code: L,
    public readonly extra?: IExtra | null
  ) {
    super(
      extra && Object.entries(extra).length
        ? `${code} \n${JSON.stringify(extra, null, 2)}`
        : code
    );
    this.status = extra?.status || 500;
    // Known issue: https://github.com/microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, Fail.prototype);
  }
}

export function fail<L extends string | 'fail'>(
  code: L = 'fail' as L,
  extra?: IExtra | null
) {
  return new Fail<typeof code>(
    code,
    extra && (JSON.parse(JSON.stringify(extra)) as IExtra)
  );
}
