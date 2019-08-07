jest.setTimeout(100000);

// const puppeteer = require("puppeteer");
const CustomPage = require("./helpers/page");

// let browser;
let page;

beforeEach(async () => {
	// browser = await puppeteer.launch({
	// 	headless: false
	// });
	page = await CustomPage.build();
	await page.goto("http://localhost:3000");
});

afterEach(async () => {
	// await browser.close();
	await page.close();
});

test("The Header has the correct text", async () => {
	const text = await page.$eval("a.brand-logo", el => el.innerHTML);
	expect(text).toEqual("Blogster");
});

test("Clicking Login starts oauth flow", async () => {
	await page.click(".right a");

	const url = await page.url();

	expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, show logout button", async () => {
	await page.login();

	const text = await page.getInnerHTML('a[href="/auth/logout"]');

	expect(text).toEqual("Logout");
});
