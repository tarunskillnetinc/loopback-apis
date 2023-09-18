"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreesService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const axios_1 = tslib_1.__importDefault(require("axios"));
const datasources_1 = require("../datasources");
const xml2js_1 = tslib_1.__importDefault(require("xml2js"));
let TreesService = exports.TreesService = class TreesService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async fetchFromEndpoint(endpoint) {
        try {
            const response = await axios_1.default.get(`${this.dataSource.settings.baseURL}/${endpoint}`);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async getConcreteProductDetails(productId) {
        const endpoint = `concrete-products/${productId}?include=concrete-product-image-sets%252cconcrete-product-availabilities`;
        return this.fetchFromEndpoint(endpoint);
    }
    async getBestSellingProduct() {
        const endpoint = `concrete-products/099_27207215?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`;
        const response = await this.fetchFromEndpoint(endpoint);
        const transformedResponse = this.extractDesiredFields(response);
        return transformedResponse;
    }
    extractDesiredFields(response) {
        var _a, _b, _c;
        // Extract desired fields from the API response
        const data = response.data;
        const attributes = data.attributes;
        const imageSet = response.included.find((item) => item.type === 'concrete-product-image-sets');
        const largeImageUrl = (_c = (_b = (_a = imageSet === null || imageSet === void 0 ? void 0 : imageSet.attributes) === null || _a === void 0 ? void 0 : _a.imageSets[0]) === null || _b === void 0 ? void 0 : _b.images[0]) === null || _c === void 0 ? void 0 : _c.externalUrlLarge;
        // Create a new response with the desired information
        return {
            productId: attributes.sku,
            skuId: attributes.sku,
            name: attributes.name,
            largeImageUrl: largeImageUrl,
        };
    }
    async getCatalogSearchSuggestions(query) {
        const endpoint = `catalog-search-suggestions?q=${query}`;
        const response = await this.fetchFromEndpoint(endpoint);
        // Extract and transform the desired fields from the response
        // const transformedResponse = this.transformCatalogSearchSuggestions(response);
        return response;
    }
    transformCatalogSearchSuggestions(response) {
        var _a, _b, _c;
        const data = response.data;
        const transformedSuggestions = ((_c = (_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.abstractProducts) === null || _c === void 0 ? void 0 : _c.map((item) => {
            var _a;
            return {
                ProductId: item.abstractSku,
                SkuId: item.abstractSku,
                ProductName: item.abstractName,
                price: item.price,
                SkuImageUrl: ((_a = item.images[0]) === null || _a === void 0 ? void 0 : _a.externalUrlLarge) || null,
            };
        })) || [];
        return transformedSuggestions;
    }
    async import(xmlData1) {
        // console.log("XML =>",xml);
        try {
            const parser = new xml2js_1.default.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(xmlData1);
            console.log("result1 =>", result);
            const builder = new xml2js_1.default.Builder();
            // const xmlResult = builder.buildObject(result);
            console.log("disocunt amount =>", result.INDATA.INVOICE.LINE.DISCOUNT_AMOUNT);
            const grossAmount = result.INDATA.INVOICE.LINE.GROSS_AMOUNT;
            const discountAmount = result.INDATA.INVOICE.LINE.DISCOUNT_AMOUNT;
            const amount = grossAmount - discountAmount;
            const effectiveTaxRate = (Math.random() * (0.120 - 0.0700) + 0.0700).toFixed(4);
            const subTaxRate = parseFloat((Math.random() * (0.080 - 0.0200) + 0.0200).toFixed(4));
            const subTaxRate2 = parseFloat((Math.random() * (0.080 - 0.0200) + 0.0200).toFixed(4));
            const subTaxRate3 = parseFloat((Math.random() * (0.080 - 0.0200) + 0.0200).toFixed(4));
            const subTaxRate4 = parseFloat((Math.random() * (0.080 - 0.0200) + 0.0200).toFixed(4));
            const taxRate = parseFloat(effectiveTaxRate);
            console.log("taxRate =>", taxRate);
            const totalTaxAmount = grossAmount * taxRate;
            const xmlData = {
                OUTDATA: {
                    $: { version: 'G' },
                    REQUEST_STATUS: {
                        IS_SUCCESS: 'true',
                        IS_PARTIAL_SUCCESS: 'true',
                    },
                    INVOICE: {
                        REQUEST_STATUS: {
                            IS_SUCCESS: 'true',
                            IS_PARTIAL_SUCCESS: 'false',
                        },
                        CALLING_SYSTEM_NUMBER: result.INDATA.CALLING_SYSTEM_NUMBER,
                        COMPANY_ID: result.INDATA.COMPANY_ID,
                        COMPANY_NAME: result.INDATA.COMPANY_NAME,
                        COMPANY_ROLE: result.INDATA.COMPANY_ROLE,
                        CURRENCY_CODE: result.INDATA.CURRENCY_CODE,
                        CURRENCY_NAME: result.INDATA.CURRENCY_NAME,
                        MIN_ACCOUNTABLE_UNIT: result.INDATA.MIN_ACCOUNTABLE_UNIT,
                        ROUNDING_PRECISION: result.INDATA.ROUNDING_PRECISION,
                        ROUNDING_RULE: result.INDATA.ROUNDING_RULE,
                        EXTERNAL_COMPANY_ID: result.INDATA.EXTERNAL_COMPANY_ID,
                        HOST_SYSTEM: result.INDATA.HOST_SYSTEM,
                        INVOICE_DATE: result.INDATA.INVOICE_DATE,
                        INVOICE_NUMBER: result.INDATA.INVOICE_NUMBER,
                        IS_CREDIT: result.INDATA.IS_CREDIT,
                        TOTAL_TAX_AMOUNT: result.INDATA.TOTAL_TAX_AMOUNT,
                        TRANSACTION_DATE: result.INDATA.TRANSACTION_DATE,
                        USER_ELEMENT: [
                            { NAME: 'ATTRIBUTE1', VALUE: 'Comm Retail' },
                            { NAME: 'ATTRIBUTE3', VALUE: 'OUTSIDE' },
                            { NAME: 'ATTRIBUTE5', VALUE: '1007' },
                        ],
                        LINE: {
                            ID: '1',
                            DISCOUNT_AMOUNT: result.INDATA.INVOICE.LINE.DISCOUNT_AMOUNT,
                            GROSS_AMOUNT: result.INDATA.INVOICE.LINE.GROSS_AMOUNT,
                            IS_BUSINESS_SUPPLY: 'true',
                            LINE_NUMBER: '1',
                            POINT_OF_TITLE_TRANSFER: 'I',
                            SHIP_FROM_COUNTRY: 'UNITED STATES',
                            SHIP_TO_COUNTRY: 'UNITED STATES',
                            TOTAL_TAX_AMOUNT: totalTaxAmount,
                            TAX_CODE: 'SABRIX',
                            TAX: [
                                {
                                    ADDRESS_TYPE: 'ST',
                                    ADMIN_ZONE_LEVEL: 'State',
                                    AUTHORITY_NAME: 'AR - STATE SALES/USE TAX',
                                    AUTHORITY_TYPE: 'State Sales/Use',
                                    CALCULATION_METHOD: '1',
                                    COMMENT: 'ORACLE[USAR]',
                                    ERP_TAX_CODE: 'USAR',
                                    EFFECTIVE_ZONE_LEVEL: 'State',
                                    INVOICE_DESCRIPTION: 'Sales Tax',
                                    JURISDICTION_TEXT: 'USSG4: Standard sales tax applies.',
                                    RULE_ORDER: '9990',
                                    TAXABLE_COUNTRY: 'US',
                                    TAXABLE_COUNTRY_NAME: 'UNITED STATES',
                                    TAXABLE_STATE: 'ARKANSAS',
                                    TAXABLE_COUNTY: 'SALINE',
                                    TAXABLE_CITY: 'BENTON',
                                    TAXABLE_POSTCODE: '72015',
                                    TAX_RATE_CODE: 'ST',
                                    TAX_TYPE: 'SA',
                                    ZONE_NAME: 'ARKANSAS',
                                    ZONE_LEVEL: 'State',
                                    TAX_RATE: subTaxRate,
                                    NATURE_OF_TAX: 'P',
                                    EU_TRANSACTION: 'false',
                                    AUTHORITY_UUID: '0dd01425-9ecd-4c5d-bfdb-baa755b0764e',
                                    AUTHORITY_CURRENCY_CODE: 'USD',
                                    CURRENCY_CONVERSION: {
                                        TAX_EXCHANGE_RATE_DATE: '2019-03-12',
                                    },
                                    EXEMPT_AMOUNT: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    GROSS_AMOUNT: {
                                        AUTHORITY_AMOUNT: amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: amount,
                                    },
                                    NON_TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: amount,
                                        AUTHORITY_AMOUNT: amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: amount,
                                    },
                                    TAX_AMOUNT: {
                                        DOCUMENT_AMOUNT: subTaxRate * amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: subTaxRate * amount,
                                        AUTHORITY_AMOUNT: subTaxRate * amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: subTaxRate * amount,
                                    },
                                    TAX_DETERMINATION_DATE: '2019-03-12',
                                    TAX_POINT_DATE: '2019-03-12',
                                },
                                {
                                    ADDRESS_TYPE: 'ST',
                                    ADMIN_ZONE_LEVEL: 'State',
                                    AUTHORITY_NAME: 'Arkansas Automobile Tire Fee',
                                    AUTHORITY_TYPE: 'EXC',
                                    CALCULATION_METHOD: '9',
                                    COMMENT: 'ORACLE[USARDF]',
                                    ERP_TAX_CODE: 'USARDF',
                                    EFFECTIVE_ZONE_LEVEL: 'State',
                                    INVOICE_DESCRIPTION: 'Tire Fee',
                                    JURISDICTION_TEXT: 'CUSTAUTHSST1: Output Tax in Ship To Location.',
                                    RULE_ORDER: '2',
                                    TAXABLE_COUNTRY: 'US',
                                    TAXABLE_COUNTRY_NAME: 'UNITED STATES',
                                    TAXABLE_STATE: 'ARKANSAS',
                                    TAXABLE_COUNTY: 'SALINE',
                                    TAXABLE_CITY: 'BENTON',
                                    TAXABLE_POSTCODE: '72015',
                                    TAX_RATE_CODE: '01TF1',
                                    TAX_TYPE: 'CA',
                                    ZONE_NAME: 'ARKANSAS',
                                    ZONE_LEVEL: 'State',
                                    TAX_RATE: subTaxRate2,
                                    UOM_CONVERSION: {
                                        FACTOR: '1',
                                        OPERATOR: 'M',
                                        FROM: {
                                            AMOUNT: '4',
                                            UOM: 'EA',
                                        },
                                        TO_ROUNDED: {
                                            AMOUNT: '4',
                                            UOM: 'EA',
                                        },
                                        TO_UNROUNDED: {
                                            AMOUNT: '4',
                                            UOM: 'EA',
                                        },
                                    },
                                    NATURE_OF_TAX: 'F',
                                    EU_TRANSACTION: 'false',
                                    AUTHORITY_UUID: '9a2e4e3b-5996-4cf1-a880-547214645099',
                                    AUTHORITY_CURRENCY_CODE: 'USD',
                                    CURRENCY_CONVERSION: {
                                        TAX_EXCHANGE_RATE_DATE: '2019-03-12',
                                    },
                                    EXEMPT_AMOUNT: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    GROSS_AMOUNT: {
                                        AUTHORITY_AMOUNT: '921.16',
                                        UNROUNDED_AUTHORITY_AMOUNT: '921.1600000000',
                                    },
                                    NON_TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: amount,
                                        AUTHORITY_AMOUNT: amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: amount,
                                    },
                                    TAX_AMOUNT: {
                                        DOCUMENT_AMOUNT: subTaxRate2 * amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: subTaxRate2 * amount,
                                        AUTHORITY_AMOUNT: subTaxRate2 * amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: subTaxRate2 * amount,
                                    },
                                    FEE: {
                                        AMOUNT: '3',
                                        CURRENCY_CODE: 'USD',
                                        UNIT_OF_MEASURE: 'each',
                                    },
                                    TAX_DETERMINATION_DATE: '2019-03-12',
                                    TAX_POINT_DATE: '2019-03-12',
                                },
                                {
                                    ADDRESS_TYPE: 'ST',
                                    ADMIN_ZONE_LEVEL: 'State',
                                    AUTHORITY_NAME: 'AR - SALINE, COUNTY SALES/USE TAX',
                                    AUTHORITY_TYPE: 'County Sales/Use',
                                    CALCULATION_METHOD: '1',
                                    COMMENT: 'ORACLE[USAR]',
                                    ERP_TAX_CODE: 'USAR',
                                    EFFECTIVE_ZONE_LEVEL: 'County',
                                    INVOICE_DESCRIPTION: 'Sales Tax',
                                    JURISDICTION_TEXT: 'USSG137: Standard Sales Tax Applies',
                                    LOCATION_CODE: '62-00',
                                    RULE_ORDER: '9991',
                                    TAXABLE_COUNTRY: 'US',
                                    TAXABLE_COUNTRY_NAME: 'UNITED STATES',
                                    TAXABLE_STATE: 'ARKANSAS',
                                    TAXABLE_COUNTY: 'SALINE',
                                    TAXABLE_CITY: 'BENTON',
                                    TAXABLE_POSTCODE: '72015',
                                    TAX_RATE_CODE: 'ST',
                                    TAX_TYPE: 'SA',
                                    ZONE_NAME: 'SALINE',
                                    ZONE_LEVEL: 'County',
                                    TAX_RATE: subTaxRate3,
                                    NATURE_OF_TAX: 'P',
                                    EU_TRANSACTION: 'false',
                                    AUTHORITY_UUID: '7930d479-50e5-4f89-bf88-c364b17bd9fc',
                                    AUTHORITY_CURRENCY_CODE: 'USD',
                                    CURRENCY_CONVERSION: {
                                        TAX_EXCHANGE_RATE_DATE: '2019-03-12',
                                    },
                                    EXEMPT_AMOUNT: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    GROSS_AMOUNT: {
                                        AUTHORITY_AMOUNT: '921.16',
                                        UNROUNDED_AUTHORITY_AMOUNT: '921.1600000000',
                                    },
                                    NON_TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: amount,
                                        AUTHORITY_AMOUNT: amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: amount,
                                    },
                                    TAX_AMOUNT: {
                                        DOCUMENT_AMOUNT: subTaxRate3 * amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: subTaxRate3 * amount,
                                        AUTHORITY_AMOUNT: subTaxRate3 * amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: subTaxRate3 * amount,
                                    },
                                    TAX_DETERMINATION_DATE: '2019-03-12',
                                    TAX_POINT_DATE: '2019-03-12',
                                },
                                {
                                    ADDRESS_TYPE: 'ST',
                                    ADMIN_ZONE_LEVEL: 'State',
                                    AUTHORITY_NAME: 'AR - BENTON, CITY SALES/USE TAX',
                                    AUTHORITY_TYPE: 'City Sales/Use',
                                    CALCULATION_METHOD: '1',
                                    COMMENT: 'ORACLE[USAR]',
                                    ERP_TAX_CODE: 'USAR',
                                    EFFECTIVE_ZONE_LEVEL: 'City',
                                    INVOICE_DESCRIPTION: 'Sales Tax',
                                    JURISDICTION_TEXT: 'USSG137: Standard Sales Tax Applies',
                                    LOCATION_CODE: '62-03',
                                    RULE_ORDER: '9991',
                                    TAXABLE_COUNTRY: 'US',
                                    TAXABLE_COUNTRY_NAME: 'UNITED STATES',
                                    TAXABLE_STATE: 'ARKANSAS',
                                    TAXABLE_COUNTY: 'SALINE',
                                    TAXABLE_CITY: 'BENTON',
                                    TAXABLE_POSTCODE: '72015',
                                    TAX_RATE_CODE: 'ST',
                                    TAX_TYPE: 'SA',
                                    ZONE_NAME: 'BENTON',
                                    ZONE_LEVEL: 'City',
                                    TAX_RATE: subTaxRate4,
                                    NATURE_OF_TAX: 'P',
                                    EU_TRANSACTION: 'false',
                                    AUTHORITY_UUID: '2f377260-baa0-4f68-ba05-b43d08719fba',
                                    AUTHORITY_CURRENCY_CODE: 'USD',
                                    CURRENCY_CONVERSION: {
                                        TAX_EXCHANGE_RATE_DATE: '2019-03-12',
                                    },
                                    EXEMPT_AMOUNT: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    GROSS_AMOUNT: {
                                        AUTHORITY_AMOUNT: '921.16',
                                        UNROUNDED_AUTHORITY_AMOUNT: '921.1600000000',
                                    },
                                    NON_TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: '0.00',
                                        UNROUNDED_DOCUMENT_AMOUNT: '0.0000000000',
                                        AUTHORITY_AMOUNT: '0.00',
                                        UNROUNDED_AUTHORITY_AMOUNT: '0.0000000000',
                                    },
                                    TAXABLE_BASIS: {
                                        DOCUMENT_AMOUNT: amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: amount,
                                        AUTHORITY_AMOUNT: amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: amount,
                                    },
                                    TAX_AMOUNT: {
                                        DOCUMENT_AMOUNT: subTaxRate4 * amount,
                                        UNROUNDED_DOCUMENT_AMOUNT: subTaxRate4 * amount,
                                        AUTHORITY_AMOUNT: subTaxRate4 * amount,
                                        UNROUNDED_AUTHORITY_AMOUNT: subTaxRate4 * amount,
                                    },
                                    TAX_DETERMINATION_DATE: '2019-03-12',
                                    TAX_POINT_DATE: '2019-03-12',
                                },
                            ],
                            TRANSACTION_TYPE: 'GS',
                            UNIT_OF_MEASURE: 'EA',
                            USER_ELEMENT: [
                                { NAME: 'ATTRIBUTE1', VALUE: 'LT Tire' },
                                { NAME: 'ATTRIBUTE2', VALUE: '18' },
                                { NAME: 'ATTRIBUTE3', VALUE: 'LINE' },
                                { NAME: 'ATTRIBUTE4', VALUE: '0' },
                                { NAME: 'ATTRIBUTE5', VALUE: '921.16' },
                                { NAME: 'ATTRIBUTE6', VALUE: '921.16' },
                                { NAME: 'ATTRIBUTE9', VALUE: 'OUTSIDE' },
                            ],
                            QUANTITIES: {
                                QUANTITY: { AMOUNT: '4', UOM: 'EA' },
                            },
                            IS_CREDIT: 'false',
                            INVOICE_DATE: '2019-03-12',
                            TAX_SUMMARY: {
                                TAXABLE_BASIS: amount,
                                NON_TAXABLE_BASIS: '0.00',
                                EXEMPT_AMOUNT: '0.00',
                                TAX_RATE: '0.09',
                                EFFECTIVE_TAX_RATE: taxRate,
                                ADVISORIES: {
                                    ADVISORY: ['Contains Fees', 'Contains Custom Authorities'],
                                },
                            },
                        },
                    }
                }
            };
            // Convert the XML data structure to a string
            const xmlString = builder.buildObject(xmlData);
            return xmlString;
        }
        catch (error) {
            console.error('Error processing XML:', error);
            throw new Error('Failed to process XML');
        }
    }
};
exports.TreesService = TreesService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('datasources.category')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.CategoryDataSource])
], TreesService);
//# sourceMappingURL=trees.service.js.map