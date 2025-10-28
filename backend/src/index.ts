/**
 * StratOS Platform - Azure Functions Entry Point
 * 
 * This file imports all function definitions to register them with the Azure Functions runtime.
 * Each function file uses app.http() to register itself.
 */

// Import all functions to register them
import './functions/chat';
import './functions/analyze-data';
import './functions/upload-document';
import './functions/search-context';
import './functions/generate-deck';
import './functions/get-conversations';
import './functions/clients';
import './functions/projects';
import './functions/onboard-tenant';
import './functions/invite-user';
import './functions/accept-invite';
import './functions/list-users';
import './functions/remove-user';
import './functions/update-user-role';
import './functions/get-tenant-usage';

// Export app for Azure Functions runtime
import { app } from '@azure/functions';
export { app };

