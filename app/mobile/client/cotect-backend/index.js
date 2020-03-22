/**
 * Cotect User Endpoints
 * User endpoints REST API for cotect project.
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from './ApiClient';
import CaseContact from './model/CaseContact';
import CasePlace from './model/CasePlace';
import CaseReport from './model/CaseReport';
import CaseSymptom from './model/CaseSymptom';
import HTTPValidationError from './model/HTTPValidationError';
import ValidationError from './model/ValidationError';
import DefaultApi from './api/DefaultApi';


/**
* User_endpoints_REST_API_for_cotect_project_.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var CotectUserEndpoints = require('index'); // See note below*.
* var xxxSvc = new CotectUserEndpoints.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new CotectUserEndpoints.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new CotectUserEndpoints.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new CotectUserEndpoints.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 0.1.0
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The CaseContact model constructor.
     * @property {module:model/CaseContact}
     */
    CaseContact,

    /**
     * The CasePlace model constructor.
     * @property {module:model/CasePlace}
     */
    CasePlace,

    /**
     * The CaseReport model constructor.
     * @property {module:model/CaseReport}
     */
    CaseReport,

    /**
     * The CaseSymptom model constructor.
     * @property {module:model/CaseSymptom}
     */
    CaseSymptom,

    /**
     * The HTTPValidationError model constructor.
     * @property {module:model/HTTPValidationError}
     */
    HTTPValidationError,

    /**
     * The ValidationError model constructor.
     * @property {module:model/ValidationError}
     */
    ValidationError,

    /**
    * The DefaultApi service constructor.
    * @property {module:api/DefaultApi}
    */
    DefaultApi
};