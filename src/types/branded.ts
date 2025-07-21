declare const __brand: unique symbol;

export type Brand<T, K> = T & { readonly [__brand]: K };

export type PropertyId = Brand<string, 'PropertyId'>;
export type AirtableRecordId = Brand<string, 'AirtableRecordId'>;
