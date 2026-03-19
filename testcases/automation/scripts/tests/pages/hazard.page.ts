import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Hazard Report Page Object
 * Handles all hazard reporting interactions
 */
export class HazardPage extends BasePage {
  // Selectors - Single source of truth
  private readonly selectors = {
    // Form elements
    locationSelect: '[data-testid="location-select"]',
    sublocationSelect: '[data-testid="sublocation-select"]',
    areaSelect: '[data-testid="area-select"]',
    areaDescriptionInput: '[data-testid="area-description-input"]',
    evidenceInput: '[data-testid="evidence-input"]',
    picSelect: '[data-testid="pic-select"]',
    submitButton: '[data-testid="submit-button"]',
    
    // Validation errors
    locationError: '[data-testid="location-error"]',
    sublocationError: '[data-testid="sublocation-error"]',
    areaError: '[data-testid="area-error"]',
    evidenceError: '[data-testid="evidence-error"]',
    
    // Success/List
    successMessage: '[data-testid="success-message"]',
    hazardList: '[data-testid="hazard-list"]',
    hazardItem: '[data-testid="hazard-item"]',
    newReportButton: '[data-testid="new-report"]',
    
    // Followup task
    resolutionEvidenceInput: '[data-testid="resolution-evidence-input"]',
    resolutionDateInput: '[data-testid="resolution-date-input"]',
    addCoObserverButton: '[data-testid="add-co-observer-button"]',
    completeTaskButton: '[data-testid="complete-task-button"]',
    completionSuccess: '[data-testid="completion-success"]'
  };

  // Locators
  get locationSelect(): Locator {
    return this.page.locator(this.selectors.locationSelect);
  }

  get sublocationSelect(): Locator {
    return this.page.locator(this.selectors.sublocationSelect);
  }

  get areaSelect(): Locator {
    return this.page.locator(this.selectors.areaSelect);
  }

  get areaDescriptionInput(): Locator {
    return this.page.locator(this.selectors.areaDescriptionInput);
  }

  get evidenceInput(): Locator {
    return this.page.locator(this.selectors.evidenceInput);
  }

  get picSelect(): Locator {
    return this.page.locator(this.selectors.picSelect);
  }

  get submitButton(): Locator {
    return this.page.locator(this.selectors.submitButton);
  }

  get successMessage(): Locator {
    return this.page.locator(this.selectors.successMessage);
  }

  get hazardList(): Locator {
    return this.page.locator(this.selectors.hazardList);
  }

  get hazardItems(): Locator {
    return this.page.locator(this.selectors.hazardItem);
  }

  // Navigation
  async gotoNewReport(): Promise<void> {
    await this.navigate('/hazard/new');
  }

  async gotoHazardList(): Promise<void> {
    await this.navigate('/hazards');
  }

  async gotoFollowupTask(taskId: string): Promise<void> {
    await this.navigate(`/followup-tasks/${taskId}`);
  }

  // Form Actions
  async selectLocation(locationId: string): Promise<void> {
    await this.locationSelect.selectOption(locationId);
    // Wait for sublocation dropdown to update (API-driven)
    await this.waitForSublocationUpdate();
  }

  async selectSublocation(sublocationId: string): Promise<void> {
    await this.sublocationSelect.selectOption(sublocationId);
    // Wait for area dropdown to update
    await this.waitForAreaUpdate();
  }

  async selectArea(areaId: string): Promise<void> {
    await this.areaSelect.selectOption(areaId);
  }

  async enterAreaDescription(description: string): Promise<void> {
    await this.areaDescriptionInput.fill(description);
  }

  async uploadEvidence(fileName: string = 'hazard.jpg'): Promise<void> {
    await this.evidenceInput.setInputFiles({
      name: fileName,
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data-for-testing')
    });
  }

  async selectPIC(employeeId: string): Promise<void> {
    await this.picSelect.selectOption(employeeId);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Fill complete hazard form with provided data
   * Demonstrates fluent interface pattern
   */
  async fillHazardForm(data: {
    locationId: string;
    sublocationId: string;
    areaId: string;
    areaDescription?: string;
    picId?: string;
  }): Promise<void> {
    await this.selectLocation(data.locationId);
    await this.selectSublocation(data.sublocationId);
    await this.selectArea(data.areaId);
    
    if (data.areaDescription) {
      await this.enterAreaDescription(data.areaDescription);
    }
    
    await this.uploadEvidence();
    
    if (data.picId) {
      await this.selectPIC(data.picId);
    }
  }

  // Followup Task Actions
  async completeFollowupTask(data: {
    resolutionDate: string;
    coObservers?: string[];
  }): Promise<void> {
    await this.page.locator(this.selectors.resolutionEvidenceInput).setInputFiles({
      name: 'resolved.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-resolved-image')
    });
    
    await this.page.locator(this.selectors.resolutionDateInput).fill(data.resolutionDate);
    
    if (data.coObservers) {
      for (let i = 0; i < data.coObservers.length; i++) {
        await this.page.locator(this.selectors.addCoObserverButton).click();
        await this.page.locator(`[data-testid="co-observer-${i}"]`).selectOption(data.coObservers[i]);
      }
    }
    
    await this.page.locator(this.selectors.completeTaskButton).click();
  }

  // Smart Waits (avoiding hardcoded timeouts)
  private async waitForSublocationUpdate(): Promise<void> {
    // Wait for sublocation select to be enabled (indicates data loaded)
    await expect(this.sublocationSelect).toBeEnabled({ timeout: 5000 });
  }

  private async waitForAreaUpdate(): Promise<void> {
    await expect(this.areaSelect).toBeEnabled({ timeout: 5000 });
  }

  // Assertions
  async expectSuccessMessageVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }

  async expectValidationErrors(): Promise<void> {
    await expect(this.page.locator(this.selectors.locationError)).toBeVisible();
    await expect(this.page.locator(this.selectors.sublocationError)).toBeVisible();
    await expect(this.page.locator(this.selectors.areaError)).toBeVisible();
    await expect(this.page.locator(this.selectors.evidenceError)).toBeVisible();
  }

  async expectPICPreselected(employeeId: string): Promise<void> {
    await expect(this.picSelect).toHaveValue(employeeId);
  }

  async expectHazardListCount(count: number): Promise<void> {
    await expect(this.hazardItems).toHaveCount(count);
  }

  async expectReportNumberVisible(reportNumber: string): Promise<void> {
    await expect(this.page.locator(`text=${reportNumber}`)).toBeVisible();
  }

  async getSublocationOptions(): Promise<string[]> {
    return this.sublocationSelect.locator('option').allTextContents();
  }

  async getAreaOptions(): Promise<string[]> {
    return this.areaSelect.locator('option').allTextContents();
  }
}
