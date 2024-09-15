import { config } from '../../Config/app.config';

/**
 * Manages the client links based on the current branch name.
 */
export class ClientHelper {
  /**
   * Gets the current client links based on the branch name.
   * @returns The client links object for the current branch.
   */
  static getCurrentClient(): { landingPage: string; shoppingApp: string } {
    const currentBranchName: string = config.environment.branchName;
    const staggingLinks: { landingPage: string; shoppingApp: string } = config.clients.stagging;
    const productionLinks: { landingPage: string; shoppingApp: string } = config.clients.production;
    return currentBranchName === 'stagging' ? staggingLinks : productionLinks;
  }
}
