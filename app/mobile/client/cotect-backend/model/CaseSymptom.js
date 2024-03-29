/**
 * Cotect User Endpoints
 * User endpoints REST API for cotect project.
 *
 * The version of the OpenAPI document: 0.1.2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The CaseSymptom model module.
 * @module model/CaseSymptom
 * @version 0.1.2
 */
class CaseSymptom {
    /**
     * Constructs a new <code>CaseSymptom</code>.
     * @alias module:model/CaseSymptom
     * @param symptomName {String} 
     */
    constructor(symptomName) { 
        
        CaseSymptom.initialize(this, symptomName);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, symptomName) { 
        obj['symptom_name'] = symptomName;
    }

    /**
     * Constructs a <code>CaseSymptom</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CaseSymptom} obj Optional instance to populate.
     * @return {module:model/CaseSymptom} The populated <code>CaseSymptom</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new CaseSymptom();

            if (data.hasOwnProperty('symptom_name')) {
                obj['symptom_name'] = ApiClient.convertToType(data['symptom_name'], 'String');
            }
            if (data.hasOwnProperty('report_date')) {
                obj['report_date'] = ApiClient.convertToType(data['report_date'], 'Date');
            }
            if (data.hasOwnProperty('severity')) {
                obj['severity'] = ApiClient.convertToType(data['severity'], 'String');
            }
        }
        return obj;
    }


}

/**
 * @member {String} symptom_name
 */
CaseSymptom.prototype['symptom_name'] = undefined;

/**
 * @member {Date} report_date
 */
CaseSymptom.prototype['report_date'] = undefined;

/**
 * @member {String} severity
 */
CaseSymptom.prototype['severity'] = undefined;






export default CaseSymptom;

