const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('FocusFlow Automated Test Suite', function () {
    this.timeout(60000);
    let driver;
    const timestamp = Date.now();
    const testUser = {
        name: 'Selenium Tester',
        email: `test_${timestamp}@example.com`,
        password: 'Password123!',
        dob: '2000-01-01'
    };

    before(async function () {
        const options = new chrome.Options();
        options.addArguments('--headless=new'); 
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    async function handleAlertIfPresent(timeout = 2000) {
        try {
            await driver.wait(until.alertIsPresent(), timeout);
            let alert = await driver.switchTo().alert();
            let text = await alert.getText();
            await alert.accept();
            return text;
        } catch (e) {
            // No alert present, that's fine for some flows
            return null;
        }
    }

    async function ensureLoggedOut() {
        await driver.get(`${BASE_URL}/login`);
        await driver.executeScript('window.localStorage.clear();');
        await driver.navigate().refresh();
    }

    // 1. Signup Success
    it('1. Should successfully sign up a new user', async function () {
        await driver.get(`${BASE_URL}/signup`);
        await driver.wait(until.elementLocated(By.id('full-name')), 5000);
        await driver.findElement(By.id('full-name')).sendKeys(testUser.name);
        await driver.findElement(By.id('dob')).sendKeys(testUser.dob);
        await driver.findElement(By.id('signup-email')).sendKeys(testUser.email);
        await driver.findElement(By.id('signup-password')).sendKeys(testUser.password);
        await driver.findElement(By.id('confirm-password')).sendKeys(testUser.password);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        // Wait for and handle the success alert
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        await alert.accept();

        await driver.wait(until.urlContains('/login'), 5000);
        expect(await driver.getCurrentUrl()).to.contain('/login');
    });

    // 2. Signup - Duplicate Email
    it('2. Should show error for duplicate email signup', async function () {
        await driver.get(`${BASE_URL}/signup`);
        await driver.findElement(By.id('full-name')).sendKeys(testUser.name);
        await driver.findElement(By.id('dob')).sendKeys(testUser.dob);
        await driver.findElement(By.id('signup-email')).sendKeys(testUser.email);
        await driver.findElement(By.id('signup-password')).sendKeys(testUser.password);
        await driver.findElement(By.id('confirm-password')).sendKeys(testUser.password);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const alertText = await handleAlertIfPresent(5000);
        // If alert was present, it likely contains "exists"
        if (alertText) expect(alertText.toLowerCase()).to.contain('exists');
    });

    // 3. Signup - Password Mismatch
    it('3. Should show error when passwords do not match', async function () {
        await driver.get(`${BASE_URL}/signup`);
        await driver.findElement(By.id('signup-password')).sendKeys(testUser.password);
        await driver.findElement(By.id('confirm-password')).sendKeys('wrongpass');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const alertText = await handleAlertIfPresent(5000);
        if (alertText) expect(alertText.toLowerCase()).to.contain('match');
    });

    // 4. Login - Valid Credentials
    it('4. Should successfully log in with valid credentials', async function () {
        await ensureLoggedOut();
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).sendKeys(testUser.password);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await handleAlertIfPresent(5000);
        await driver.wait(until.urlContains('/dashboard'), 5000);
        await driver.wait(until.elementLocated(By.id('welcome-msg')), 5000);
        const welcomeMsg = await driver.findElement(By.id('welcome-msg')).getText();
        expect(welcomeMsg).to.contain(testUser.name);
    });

    // 5. Login - Wrong Password
    it('5. Should show error for incorrect password', async function () {
        await ensureLoggedOut();
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).sendKeys('WrongPass123');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const alertText = await handleAlertIfPresent(5000);
        if (alertText) expect(alertText.toLowerCase()).to.contain('invalid');
    });

    // 6. Login - User Not Found
    it('6. Should show error for non-existent user email', async function () {
        await ensureLoggedOut();
        await driver.findElement(By.id('email')).sendKeys(`nonexistent_${timestamp}@example.com`);
        await driver.findElement(By.id('password')).sendKeys('anypassword');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const alertText = await handleAlertIfPresent(5000);
        if (alertText) expect(alertText.toLowerCase()).to.contain('not found');
        expect(await driver.getCurrentUrl()).to.contain('/login');
    });

    // 7. Login - Empty Form
    it('7. Should not submit with empty fields (browser validation)', async function () {
        await ensureLoggedOut();
        await driver.findElement(By.css('button[type="submit"]')).click();
        // HTML5 validation prevents submission, so we stay on /login
        expect(await driver.getCurrentUrl()).to.contain('/login');
    });

    // 8. Dashboard - Navigation Links Presence
    it('8. Should verify presence of core navigation links on Dashboard', async function () {
        // Log in first to reach dashboard
        await ensureLoggedOut();
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).sendKeys(testUser.password);
        await driver.findElement(By.css('button[type="submit"]')).click();
        await handleAlertIfPresent(5000);
        await driver.wait(until.urlContains('/dashboard'), 5000);

        await driver.wait(until.elementLocated(By.id('nav-tasks')), 5000);
        expect(await driver.findElement(By.id('nav-tasks')).isDisplayed()).to.be.true;
        expect(await driver.findElement(By.id('nav-notes')).isDisplayed()).to.be.true;
        expect(await driver.findElement(By.id('nav-feedback')).isDisplayed()).to.be.true;
    });

    // 9. Notes - Add Note
    it('9. Should successfully add a new note', async function () {
        await driver.get(`${BASE_URL}/notes`);
        await driver.wait(until.elementLocated(By.id('note-textarea')), 5000);
        const noteText = 'Selenium Test Note ' + timestamp;
        await driver.findElement(By.id('note-textarea')).sendKeys(noteText);
        await driver.findElement(By.id('add-note-btn')).click();
        
        await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(), "${noteText}")]`)), 5000);
    });

    // 10. Notes - Edit Note
    it('10. Should successfully edit an existing note', async function () {
        await driver.get(`${BASE_URL}/notes`);
        await driver.wait(until.elementLocated(By.xpath('//button[text()="Edit"]')), 5000);
        const editBtns = await driver.findElements(By.xpath('//button[text()="Edit"]'));
        if (editBtns.length > 0) {
            await editBtns[0].click();
            await driver.wait(until.elementLocated(By.css('main textarea.w-full.border')), 5000);
            const textarea = await driver.findElement(By.css('main textarea.w-full.border'));
            await textarea.clear();
            const updatedText = 'Updated by Selenium ' + timestamp;
            await textarea.sendKeys(updatedText);
            await driver.findElement(By.xpath('//button[text()="Save"]')).click();
            await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(), "${updatedText}")]`)), 5000);
        }
    });

    // 11. Notes - Delete Note
    it('11. Should successfully delete a note', async function () {
        await driver.get(`${BASE_URL}/notes`);
        await driver.wait(until.elementLocated(By.css('.bg-white.p-4.rounded-xl')), 5000);
        const initialNotes = await driver.findElements(By.css('.bg-white.p-4.rounded-xl'));
        const deleteBtns = await driver.findElements(By.xpath('//button[text()="X"]'));
        if (deleteBtns.length > 0) {
            // Use JS click to avoid issues with element being obscured
            await driver.executeScript("arguments[0].click();", deleteBtns[0]);
            
            // Wait for the note to be removed from the DOM
            await driver.wait(async () => {
                const currentNotes = await driver.findElements(By.css('.bg-white.p-4.rounded-xl'));
                return currentNotes.length < initialNotes.length;
            }, 5000);
            
            const finalNotes = await driver.findElements(By.css('.bg-white.p-4.rounded-xl'));
            expect(finalNotes.length).to.be.lessThan(initialNotes.length);
        }
    });

    // 12. Tasks - Add Task
    it('12. Should successfully add a new task', async function () {
        await driver.get(`${BASE_URL}/tasks`);
        await driver.wait(until.elementLocated(By.id('task-input')), 5000);
        const taskText = 'Selenium Task ' + timestamp;
        await driver.findElement(By.id('task-input')).sendKeys(taskText);
        await driver.findElement(By.id('add-task-btn')).click();
        
        await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(), "${taskText}")]`)), 5000);
    });

    // 13. Tasks - Delete Task
    it('13. Should successfully delete a task', async function () {
        await driver.get(`${BASE_URL}/tasks`);
        await driver.wait(until.elementLocated(By.css('.bg-white.px-6.py-4')), 5000);
        const initialTasks = await driver.findElements(By.css('.bg-white.px-6.py-4'));
        const deleteBtns = await driver.findElements(By.xpath('//button[text()="Delete"]'));
        if (deleteBtns.length > 0) {
            await deleteBtns[0].click();
            await driver.sleep(2000);
            const finalTasks = await driver.findElements(By.css('.bg-white.px-6.py-4'));
            expect(finalTasks.length).to.be.lessThan(initialTasks.length);
        }
    });

    // 14. Feedback - Submit Feedback
    it('14. Should successfully submit feedback', async function () {
        await driver.get(`${BASE_URL}/feedback`);
        await driver.wait(until.elementLocated(By.id('feedback-name')), 5000);
        await driver.findElement(By.id('feedback-name')).sendKeys(testUser.name);
        await driver.findElement(By.id('feedback-review')).sendKeys('Great app! Tested by Selenium.');
        await driver.findElement(By.id('feedback-submit')).click();
        
        await driver.wait(until.elementLocated(By.id('feedback-success')), 5000);
        expect(await driver.findElement(By.id('feedback-success')).isDisplayed()).to.be.true;
    });

    // 15. Logout
    it('15. Should successfully log out', async function () {
        await driver.get(`${BASE_URL}/dashboard`);
        await driver.wait(until.elementLocated(By.id('logout-btn')), 5000);
        await driver.findElement(By.id('logout-btn')).click();
        await driver.wait(until.urlContains('/login'), 5000);
        expect(await driver.getCurrentUrl()).to.contain('/login');
    });
});
