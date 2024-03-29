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


import ApiClient from "../ApiClient";
import CaseReport from '../model/CaseReport';
import HTTPValidationError from '../model/HTTPValidationError';

/**
* Reports service.
* @module api/ReportsApi
* @version 0.1.2
*/
export default class ReportsApi {

    /**
    * Constructs a new ReportsApi. 
    * @alias module:api/ReportsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the deleteReport operation.
     * @callback module:api/ReportsApi~deleteReportCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Deletes a user with all reported information.
     * Deletes the user node and all of the node relations.
     * @param {module:api/ReportsApi~deleteReportCallback} callback The callback function, accepting three arguments: error, data, response
     */
    deleteReport(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['APIKeyHeader', 'APIKeyQuery', 'HTTPBearer'];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;
      return this.apiClient.callApi(
        '/reports', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the updateReport operation.
     * @callback module:api/ReportsApi~updateReportCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Creates or updates the user case report.
     * @param {module:model/CaseReport} caseReport 
     * @param {module:api/ReportsApi~updateReportCallback} callback The callback function, accepting three arguments: error, data, response
     */
    updateReport(caseReport, callback) {
      let postBody = caseReport;
      // verify the required parameter 'caseReport' is set
      if (caseReport === undefined || caseReport === null) {
        throw new Error("Missing the required parameter 'caseReport' when calling updateReport");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['APIKeyHeader', 'APIKeyQuery', 'HTTPBearer'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = null;
      return this.apiClient.callApi(
        '/reports', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
