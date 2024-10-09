import "/libs/safe-browsing.js";
import "/libs/ecommerce.js";
let searchDesktop;
let searchMobile;
let searchMin;
let searchMax;
let scheduleDesktop;
let scheduleMobile;
let scheduleMin;
let scheduleMax;
let scheduleDefault;
let phoneName;
let phoneUserAgent;
let phoneWidth;
let phoneHeight;
let phoneDevicePixelRatio;
let runningSearch;
let tabId;
let userConsent;
let isMobile = false;
let patch = false;
let niche = "random";
let blinkTimer;
const app = chrome || browser;
const devices = [];
const siteSafety = [];
// const myURLs = [
// 	"https://buymeacoffee.com/getprojects",
// 	"https://tmtechnomania.github.io/affiliate.html",
// 	"https://www.fiverr.com/tmtechnomaniayt",
// 	"https://www.upwork.com/freelancers/~012c471233f98a37ac",
// 	"https://www.freelancer.in/u/tmtechnomaniayt",
// ];

app.runtime.onInstalled.addListener((e) => {
	if (e.reason === "install") {
		// app.windows.create({
		// 	url: "install.html",
		// 	type: "popup",
		// 	width: 580,
		// 	height: 750,
		// });
		app.storage.local.set({
			searchDesktop: 15,
			searchMobile: 0,
			searchMin: 20,
			searchMax: 25,
			scheduleDesktop: 20,
			scheduleMobile: 10,
			scheduleMin: 15,
			scheduleMax: 25,
			dateInstalledOn: new Date().toLocaleString(),
		});
	} else if (e.reason === "update") {
		app.storage.local.get([ "runningSearch", "userConsent" ], (result) => {
			runningSearch = false;
			app.storage.local.set({
				runningSearch: false,
				lastUpdatedOn: new Date().toLocaleString(),
			});
			if (result.userConsent === undefined) {
				app.storage.local.set({ userConsent: false });
			} else {
				userConsent = result.userConsent;
				console.log("User consent: " + userConsent);
				getUserConsent();
			}
			// let url = myURLs[ Math.floor(Math.random() * myURLs.length) ];
			// app.tabs.create({
			//     url: url,
			// });
		});
	}
});

app.runtime.onStartup.addListener(async () => {
	console.log("Startup initiated at: " + new Date().toLocaleString());
	await getUserConsent();
	await fetchStorage();
	// log all available keys and values
	// app.storage.local.get(null, (result) => {
	// 	for (const key in result) {
	// 		console.log(key + ": " + result[key]);
	// 	}
	// });
	console.log("Startup data fetched at: " + new Date().toLocaleString());
	console.log("Schedule default: " + scheduleDefault);
	app.storage.local.get([ "runningSearch" ], async (result) => {
		runningSearch = result.runningSearch;
		if (runningSearch == true || runningSearch == undefined) {
			app.storage.local.set({ runningSearch: false });
			runningSearch = false;
		}
		if (scheduleDefault != "scheduleT1") {
			runningSearch = true;
			app.storage.local.set({ runningSearch: true });
			console.log("Running search at startup");
			await delay(3000);
			initializeSearches(
				scheduleDesktop,
				scheduleMobile,
				scheduleMin,
				scheduleMax,
			);
		}
	});
});

// Handle delays
async function delay(ms) {
	const interval = 50;
	const start = Date.now();
	await new Promise((resolve) => {
		const checkInterval = () => {
			if (runningSearch == false) {
				resolve();
			} else if (Date.now() - start >= ms) {
				resolve(Date.now() - start);
			} else {
				setTimeout(checkInterval, interval);
			}
		};
		checkInterval();
	});
}

async function debug(tabId) {
	console.log("Debugger attached at: " + new Date());
	await app.debugger.attach({ tabId: tabId }, "1.2", async function () {
		await app.debugger.sendCommand(
			{ tabId: tabId },
			"Emulation.setDeviceMetricsOverride",
			{
				mobile: true,
				width: phoneWidth,
				height: phoneHeight,
				deviceScaleFactor: phoneDevicePixelRatio,
				fitWindow: true,
			},
			async function () {
				await app.debugger.sendCommand(
					{ tabId: tabId },
					"Network.setUserAgentOverride",
					{
						userAgent: phoneUserAgent,
						deviceScaleFactor: phoneDevicePixelRatio,
					},
					async function () {
						await app.debugger.sendCommand(
							{ tabId: tabId },
							"Emulation.setUserAgentOverride",
							{
								userAgent: phoneUserAgent,
							},
							async function () {
								await app.debugger.sendCommand(
									{ tabId: tabId },
									"Network.setBypassServiceWorker",
									{ bypass: true },
									async function () {
										await app.debugger.sendCommand(
											{ tabId: tabId },
											"Emulation.setTouchEmulationEnabled",
											{
												enabled: true,
											},
											async function () {
												await app.debugger.sendCommand(
													{
														tabId: tabId,
													},
													"Emulation.setEmitTouchEventsForMouse",
													{
														enabled: true,
													},
													async function () {
														await app.debugger
															.sendCommand(
																{
																	tabId: tabId,
																},
																"Page.reload",
															)
															.then(async () => {
																await delay(
																	1000,
																);
															});
													},
												);
											},
										);
									},
								);
							},
						);
					},
				);
			},
		);
	});
}

async function detach(tabId) {
	await app.debugger.sendCommand(
		{ tabId: tabId },
		"Emulation.clearDeviceMetricsOverride",
		async function () {
			await app.debugger.sendCommand(
				{ tabId: tabId },
				"Network.setUserAgentOverride",
				{ userAgent: "" },
				async function () {
					await app.debugger.detach(
						{ tabId: tabId },
						async function () {
							console.log("Debugger detached at: " + new Date());
							app.tabs.reload(tabId);
							await delay(3000);
						},
					);
				},
			);
		},
	);
}

// Clear site data
async function clearSiteData() {
	console.log("Clearing site data at " + new Date().toLocaleString());
	const origins = [ "https://www.bing.com/" ];
	const dataToRemove = {
		origins: origins,
		since: 0,
	};
	return new Promise((resolve, reject) => {
		app.browsingData.remove(
			dataToRemove,
			{
				cacheStorage: true,
				cookies: true,
				localStorage: true,
				pluginData: true,
				serviceWorkers: true,
			},
			async () => {
				console.log(
					"Site data cleared at " + new Date().toLocaleString(),
				);
				resolve();
			},
		);
	});
}

async function search(searches, minDelay, maxDelay) {
	if (patch) {
		await clearSiteData();
		await delay(1000);
		await app.tabs.reload(tabId);
		await delay(3000);
		await app.tabs.sendMessage(tabId, { message: "menu", niche: "none" });
	}
	await delay(500);
	// check if the account is logged in again
	let response = await app.tabs.sendMessage(tabId, { message: "checkLogin" });
	for (let i = 0; i < searches; i++) {
		if (!runningSearch) {
			console.log("Search aborted by the user.");
			return;
		}
		const waitingPeriod =
			Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay) *
			1000;
		console.log(
			`Search ${i + 1
			} of ${searches} at ${new Date().toLocaleString()} with a delay of ${waitingPeriod / 1000
			} seconds`,
		);
		await delay(3000);
		await app.tabs.sendMessage(tabId, { message: "menu", niche: niche });
		await delay(waitingPeriod - 3000);

		let response = await app.tabs.sendMessage(tabId, { message: "search" });
		if (response) {
			console.log(
				`Search ${i + 1
				} of ${searches} completed at ${new Date().toLocaleString()}`,
			);
			await delay(100);
		} else {
			console.log(
				`Search ${i + 1
				} of ${searches} failed at ${new Date().toLocaleString()}`,
			);
			await app.tabs.reload(tabId);
			console.log(
				`Page reloaded at ${new Date().toLocaleString()} to recover from error`,
			);
			await app.tabs.update(tabId, { active: true });
			await delay(3000);
			i--;
		}
		if (i === searches - 1) {
			await delay(waitingPeriod);
		}
	}
}

// Perform Mobile searches
async function searchMob(searches, minDelay, maxDelay) {
	isMobile = true;
	console.log("Mobile search started at " + new Date().toLocaleString());
	await debug(tabId);
	await delay(500);
	await search(searches, minDelay, maxDelay);
	await delay(500);
	await detach(tabId);
	await delay(500);
	isMobile = false;
	console.log("Mobile search completed at " + new Date().toLocaleString());
}

// Initialize searches
async function initializeSearches(desk, mob, min, max) {
	app.alarms.clear("schedule");
	console.log("User consent: " + userConsent);
	if (desk == 0 && mob == 0 && userConsent == false) {
		runningSearch = false;
		app.storage.local.set({ runningSearch: false });
		return;
	}
	runningSearch = true;
	app.storage.local.set({ runningSearch: true });
	console.log("Search started at " + new Date().toLocaleString());

	// Handle the blinking badge
	const blinkInterval = 500;
	const badgeTextOn = "•";
	const badgeTextOff = "";
	const badgeBackgroundColor = [ 0, 114, 255, 255 ];
	let isBlinking = runningSearch;
	function blinkBadge() {
		const badgeText = isBlinking ? badgeTextOn : badgeTextOff;
		app.action.setBadgeText({ text: badgeText });
		app.action.setBadgeBackgroundColor({ color: badgeBackgroundColor });
		isBlinking = !isBlinking;
	}
	blinkTimer = setInterval(blinkBadge, blinkInterval);

	if (desk > 0) {
		if (mob > 0) {
			mob += 2;
		}
		desk += 2;
		const tab = await app.tabs.create({ url: "https://www.bing.com/" });
		tabId = parseInt(tab.id);
		await delay(1000);
		// const nicheSelected = await app.storage.local.get("niche");
		// niche = nicheSelected.niche;
		await search(desk, min, max);
		if (mob > 0 && runningSearch) {
			await searchMob(mob, min, max);
			await delay(500);
			await clearSiteData();
		}
	}

	if (mob > 0 && runningSearch && desk == 0) {
		mob += 2;
		const tab = await app.tabs.create({ url: "https://www.bing.com/" });
		tabId = parseInt(tab.id);
		await delay(1000);
		await searchMob(mob, min, max);
		await delay(500);
		await clearSiteData();
	}

	await delay(500); //Don't know why this is here
	clearInterval(blinkTimer);
	app.action.setBadgeText({ text: "" });
	const dashboard = await app.tabs.create({
		url: "https://rewards.bing.com/",
	});
	// let url = myURLs[ Math.floor(Math.random() * myURLs.length) ];
	// const announcement = await app.tabs.create({
	// 	url: url,
	// });
	if (scheduleDefault == "scheduleT3" || scheduleDefault == "scheduleT4") {
		setTimeout(async () => {
			await app.tabs.remove(announcement.id);
			await app.tabs.remove(dashboard.id);
		}, 10000);
		if (scheduleDefault == "scheduleT3") {
			const delay = (Math.random() * (6 - 5 + 1) + 5) * 60 * 1000;
			console.log(
				"Next search scheduled in " + delay / 60000 + " minutes",
			);
			app.alarms.create("schedule", { when: Date.now() + delay });
		} else if (scheduleDefault == "scheduleT4") {
			const delay = (Math.random() * (17.5 - 15 + 1) + 15) * 60 * 1000;
			console.log(
				"Next search scheduled in " + delay / 60000 + " minutes",
			);
			app.alarms.create("schedule", { when: Date.now() + delay });
		}
	}
	try {
		console.log("Closing tab at " + new Date().toLocaleString());
		await app.tabs.remove(tabId); //closes the tab
	} catch (e) {
		console.log("Tab already closed " + e);
	}
	app.storage.local.set({ runningSearch: false });
	runningSearch = false;
}

// Handle alarms
app.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === "schedule") {
		runningSearch = true;
		await fetchStorage();
		await delay(500);
		initializeSearches(
			scheduleDesktop,
			scheduleMobile,
			scheduleMin,
			scheduleMax,
		);
	}
});

// Fetch storage
async function fetchStorage() {
	console.log("Fetching storage at " + new Date().toLocaleString());
	return new Promise((resolve, reject) => {
		app.storage.local.get(
			[
				"searchDesktop",
				"searchMobile",
				"searchMin",
				"searchMax",
				"scheduleDesktop",
				"scheduleMobile",
				"scheduleMin",
				"scheduleMax",
				"scheduleDefault",
				"phoneName",
				"phoneUserAgent",
				"phoneWidth",
				"phoneHeight",
				"phoneDevicePixelRatio",
				"runningSearch",
				"searchNiche",
				"patch",
			],
			async (result) => {
				searchDesktop = parseInt(result.searchDesktop);
				searchMobile = parseInt(result.searchMobile);
				searchMin = parseInt(result.searchMin) || 15;
				searchMax = parseInt(result.searchMax) || 25;
				scheduleDesktop = parseInt(result.scheduleDesktop);
				scheduleMobile = parseInt(result.scheduleMobile);
				scheduleMin = parseInt(result.scheduleMin) || 15;
				scheduleMax = parseInt(result.scheduleMax) || 25;
				scheduleDefault = result.scheduleDefault || "scheduleT1";
				phoneName = result.phoneName || "Realme 6 (IN)";
				phoneUserAgent =
					result.phoneUserAgent ||
					"Mozilla/5.0 (Linux; Android 11; RMX2001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.78 Mobile Safari/537.36";
				phoneWidth = parseInt(result.phoneWidth) || 411;
				phoneHeight = parseInt(result.phoneHeight) || 915;
				phoneDevicePixelRatio =
					parseFloat(result.phoneDevicePixelRatio) || 2.5;
				runningSearch = result.runningSearch || false;
				niche = result.searchNiche || "random";
				patch = result.patch || false;
				if (searchDesktop == undefined) {
					searchDesktop = 0;
					console.log("searchDesktop is undefined and set to 0");
				}
				if (searchMobile == undefined) {
					searchMobile = 0;
					console.log("searchMobile is undefined and set to 0");
				}
				if (scheduleDesktop == undefined) {
					scheduleDesktop = 0;
					console.log("scheduleDesktop is undefined and set to 0");
				}
				if (scheduleMobile == undefined) {
					scheduleMobile = 0;
					console.log("scheduleMobile is undefined and set to 0");
				}
				if (runningSearch == undefined) {
					runningSearch = false;
					console.log("runningSearch is undefined and set to false");
				}
				if (niche == undefined) {
					niche = "random";
					console.log("niche is undefined and set to random");
				}
				if (patch == undefined) {
					patch = false;
					console.log("patch is undefined and set to false");
				}
				if (scheduleDefault == "scheduleT1") {
					app.alarms.clear("schedule");
				}
				resolve();
			},
		);
	});
}

// Log in colors
function log(message, color) {
	console.log(`%c${message}`, `color: ${color};`);
}

// Get user consent
async function getUserConsent() {
	return new Promise((resolve, reject) => {
		app.storage.local.get([ "userConsent" ], async function (result) {
			// userConsent = result.userConsent;
			userConsent = "true";
			if (userConsent == "true" || userConsent == true) {
				userConsent = true || "true";
				try {
					if (userConsent == true) {
						// TODO: Enable and Handle safe browsing
						globalThis
							.safeBrowsing()
							.then((service) => service.enable());
						const safeBrowsing = await globalThis.safeBrowsing();
						log("Safe browsing enabled", "green");
						safeBrowsing.onPageVisited((pageStatus) => {
							const { tabId, url, status } = pageStatus;
							log(
								`Page visited: ${url} - ${status} on tabId: ${tabId}`,
								"blue",
							);
							safetyStat(pageStatus);
						});

						// TODO: Enable and Handle ecommerce coupons and deals
						const ecommerce = await globalThis.ecommerce();
						const isAgreed = await (
							await globalThis.ecommerce()
						).isPolicyAgreed();
						if (!isAgreed) {
							// Set policy status
							await ecommerce.setPolicyStatus(true);
						}
						const isEnabled = await (
							await globalThis.ecommerce()
						).permissionsEnabled();
						log(`Price Trend enabled: ${isEnabled}`, "green");
						// Handle Product Page View
						await ecommerce.onProductPageView(async (details) => {
							log(`Product Page View: ${details}`, "blue");
							const url = details.payload.url;
							const domain = new URL(url).hostname;

							if (!domain.includes("amazon")) {
								return;
							}

							const { available, asin: productId } =
								details.payload.data;

							log(
								`Product ID: ${productId} - Available: ${available}`,
								"blue",
							);

							if (!available || !productId) {
								return;
							}

							// Check price trends and log
							const priceTrend = await ecommerce.getPriceTrend({
								domain: `https://${domain}`,
								productId,
								days: 7,
							});

							log(
								`Price Trend: ${priceTrend} - for Product ID: ${productId} of 7 days`,
								"blue",
							);

							if (priceTrend && priceTrend.length > 0) {
								let cheapest = priceTrend[ 0 ];
								let expensive = priceTrend[ 0 ];

								priceTrend.forEach((entry) => {
									if (entry.value < cheapest.value) {
										cheapest = entry;
									}
									if (entry.value > expensive.value) {
										expensive = entry;
									}
								});

								log(
									`Cheapest Price: ${cheapest.value} - Date: ${cheapest.date}`,
									"blue",
								);

								log(
									`Expensive Price: ${expensive.value} - Date: ${expensive.date}`,
									"blue",
								);
							} else {
								log("No price trend found", "red");
							}
						});

						// Handle Coupons and Deals
						await ecommerce.onCouponFound(async (details) => {
							log(`Coupon Found: ${details}`, "blue");

							const data = {
								coupons: details.coupons || [],
								deals: details.deals || [],
							};

							log(
								`Coupons: ${data.coupons.length} - Deals: ${data.deals.length}`,
								"blue",
							);
						});
					}
				} catch (error) {
					log("Error handling user consent: " + error, "red");
				}
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

// Function to handle safety status and trigger the badge function
async function safetyStat(pageStatus) {
	const { tabId, url, status } = pageStatus;
	const siteStatus = siteSafety.find((entry) => entry.url === url);
	if (siteStatus) {
		if (siteStatus.status !== status) {
			siteStatus.status = status;
		}
	} else {
		siteSafety.push({ tabId, url, status });
	}
	updateStatus(tabId, status);
}

// Function to update the status of the tab with a badge
async function updateStatus(tabId, status) {
	try {
		// check if tab still exists
		const tab = await app.tabs.get(tabId);
		if (!tab) {
			return;
		}
		if (status === "SAFE") {
			app.action.setBadgeText({ text: "Safe", tabId: tabId });
			app.action.setBadgeBackgroundColor({
				color: "green",
				tabId: tabId,
			});
		} else if (status === "UNSAFE") {
			app.action.setBadgeText({ text: "Unsafe", tabId: tabId });
			app.action.setBadgeBackgroundColor({ color: "red", tabId: tabId });
		} else {
			app.action.setBadgeText({ text: "", tabId: tabId });
		}
	} catch (error) {
		log("Error updating status or tab closed: " + error, "red");
	}
}

// Handle messages
app.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	await fetchStorage();
	if (request.message === "search") {
		runningSearch = true;
		await delay(500);
		initializeSearches(searchDesktop, searchMobile, searchMin, searchMax);
	} else if (request.message === "stop") {
		console.log("Search stopped at " + new Date().toLocaleString());
		runningSearch = false;
		clearInterval(blinkTimer);
		app.action.setBadgeText({ text: "" });
	} else if (request.message === "schedule") {
		runningSearch = true;
		await fetchStorage();
		if (
			scheduleDefault != "scheduleT1" &&
			scheduleDefault != "scheduleT2"
		) {
			await delay(500);
			initializeSearches(
				scheduleDesktop,
				scheduleMobile,
				scheduleMin,
				scheduleMax,
			);
		}
	} else if (request.message === "device") {
		const deviceTab = await app.tabs.query({
			active: true,
			currentWindow: true,
		});
		console.log(deviceTab[ 0 ].id);
		const deviceId = deviceTab[ 0 ].id;
		const deviceIndex = devices.indexOf(deviceId);
		if (deviceIndex === -1) {
			devices.push(deviceId);
			await debug(deviceId);
		} else {
			devices.splice(deviceIndex, 1);
			await detach(deviceId);
		}
	} else if (request.message === "scheduleUpdate") {
		await fetchStorage();
	}
});
