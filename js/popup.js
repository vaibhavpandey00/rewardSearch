const app = chrome || browser;
let userConsent = true;
const width = screen.width;
const popupWidth = width * 0.2;
const scale = width / 1920;
$("body").css("width", popupWidth);
$("body").css("--scale", scale);

// (async () => {
// 	const visitedUpdatePolicy = await app.storage.local.get(
// 		"visitedUpdatePolicy",
// 	);
// 	if (!visitedUpdatePolicy.visitedUpdatePolicy) {
// 		app.storage.local.set({ visitedUpdatePolicy: true });
// 		window.location.href = "install.html";
// 	}
// })();

// handle ecommerce permissions
(async () => {
	const config = await globalThis.ecommerceConfig();
	console.log("Config", config);
})();


const smartphones = [
	{
		phone: "Realme 6 (IN)",
		userAgent:
			"Mozilla/5.0 (Linux; Android 11; RMX2001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.78 Mobile Safari/537.36",
		width: 411,
		height: 915,
		devicePixelRatio: 2.5,
	}
]

$(document).ready(function () {
	setTimeout(() => {
		const width = screen.width;
		const popupWidth = width * 0.2;
		const scale = width / 1920;
		$("body").css("width", popupWidth);
		$("body").css("--scale", scale);
	}, 100);

	const $search = $("#search");
	const $searchDiv = $("#searchDiv");
	const $schedule = $("#schedule");
	const $scheduleDiv = $("#scheduleDiv");

	const $searchRandom = $("#searchRandom");

	const $searchDesktop = $("#searchDesktop");
	const $searchMobile = $("#searchMobile");
	const $scheduleDesktop = $("#scheduleDesktop");
	const $scheduleMobile = $("#scheduleMobile");

	const $searchPerform = $("#searchPerform");
	const $schedulePerform = $("#schedulePerform");
	const $stopDiv = $("#stopDiv");
	const $stop = $("#stop");

	const $searchMin = $("#searchMin");
	const $searchMax = $("#searchMax");
	const $scheduleMin = $("#scheduleMin");
	const $scheduleMax = $("#scheduleMax");

	const $searchT1 = $("#searchT1");
	const $searchT2 = $("#searchT2");
	const $searchT3 = $("#searchT3");
	const $searchT4 = $("#searchT4");

	const $scheduleT1 = $("#scheduleT1");
	const $scheduleT2 = $("#scheduleT2");
	const $scheduleT3 = $("#scheduleT3");
	const $scheduleT4 = $("#scheduleT4");

	// const $yesPatch = $("#yesPatch");
	// const $noPatch = $("#noPatch");

	// app.storage.local.get([ "patch" ], (result) => {
	// 	if (!result.patch) {
	// 		app.storage.local.set({ patch: false });
	// 		$noPatch.addClass("selected");
	// 	}
	// 	if (result.patch == true) {
	// 		$yesPatch.addClass("selected");
	// 	} else {
	// 		$noPatch.addClass("selected");
	// 	}
	// });

	// $yesPatch.click(function () {
	// 	$noPatch.removeClass("selected");
	// 	$yesPatch.addClass("selected");
	// 	app.storage.local.set({ patch: true });
	// });

	// $noPatch.click(function () {
	// 	$yesPatch.removeClass("selected");
	// 	$noPatch.addClass("selected");
	// 	app.storage.local.set({ patch: false });
	// });

	const $device = $("#device");

	const $shuffle = $("#shuffle");

	const alerts = $("#stopDiv h4");
	// on a delay of 3 sec, change the text from an array of strings
	// async function titleUpdate() {
	// 	const promts = [
	// 		"Greetings! while your searches are in progress, check out my other extensions and consider joining the journey!",
	// 		"The Amazon affiliate page helps the extension without charging you any extra cost.",
	// 		"Always check the announcement page for updates and new feature releases!",
	// 		"If you have any suggestions or feedback, feel free to contact me!",
	// 		"If you like the extension, consider leaving a review",
	// 		"You can always try reinstalling the extension if you face any issues",
	// 	];
	// 	setTimeout(() => {
	// 		const random = Math.floor(Math.random() * promts.length);
	// 		alerts.text(promts[ random ]);
	// 		titleUpdate();
	// 	}, 5000);
	// }
	// titleUpdate();

	app.storage.local.get([ "runningSearch", "phoneName" ], (result) => {
		if (!result.runningSearch) {
			$stopDiv.css("display", "none");
		} else {
			$stopDiv.css("display", "flex");
		}
		if (result.phoneName) {
			$shuffle.text(result.phoneName);
			console.log("Selected simulation device:", result.phoneName);
		}
		else {
			// const randomPhone = smartphones[ Math.floor(Math.random() * smartphones.length) ];
			const randomPhone = smartphones[ 0 ];
			console.log("New simulation device", randomPhone);
			const phoneName = randomPhone.phone;
			const phoneUserAgent = randomPhone.userAgent;
			const phoneWidth = randomPhone.width;
			const phoneHeight = randomPhone.height;
			const phoneDevicePixelRatio = randomPhone.devicePixelRatio;
			app.storage.local.set({
				phoneName: phoneName,
				phoneUserAgent: phoneUserAgent,
				phoneWidth: phoneWidth,
				phoneHeight: phoneHeight,
				phoneDevicePixelRatio: phoneDevicePixelRatio,
			});
			$shuffle.text(phoneName);
		}
	});

	// $shuffle.click(function () {
	// 	app.storage.local.remove([
	// 		"phoneName",
	// 		"phoneUserAgent",
	// 		"phoneWidth",
	// 		"phoneHeight",
	// 		"phoneDevicePixelRatio",
	// 	]);
	// 	location.reload();
	// });

	$search.click(function () {
		console.log("search clicked");
		$search.addClass("selected");
		$schedule.removeClass("selected");
		$searchDiv.show();
		$scheduleDiv.hide();
	});

	$schedule.click(function () {
		console.log("schedule clicked");
		$search.removeClass("selected");
		$schedule.addClass("selected");
		$searchDiv.hide();
		$scheduleDiv.show();
	});

	$search.click();

	async function niche() {
		app.storage.local.get([ "searchNiche" ], (result) => {
			if (!result.searchNiche) {
				app.storage.local.set({ searchNiche: "Random" });
				$searchRandom.addClass("selected");
			} else {
				$(`#search${result.searchNiche}`).addClass("selected");
			}
		});
	}
	niche();

	$(".searchNiche").click(async function () {
		console.log(this);
		const niche = $(this).attr("id").replace("search", "");
		$(".searchNiche").removeClass("selected");
		$(this).addClass("selected");
		await app.storage.local.set({ searchNiche: niche });
	});

	async function store() {
		console.log("Storing values");
		app.storage.local.set({
			searchDesktop: $searchDesktop.val(),
			searchMobile: $searchMobile.val(),
			scheduleDesktop: $scheduleDesktop.val(),
			scheduleMobile: $scheduleMobile.val(),
			searchMin: $searchMin.val(),
			searchMax: $searchMax.val(),
			scheduleMin: $scheduleMin.val(),
			scheduleMax: $scheduleMax.val(),
		});
		compare();
	}

	function fetch() {
		console.log("Fetching values");
		app.storage.local.get(
			[
				"searchDesktop",
				"searchMobile",
				"scheduleDesktop",
				"scheduleMobile",
				"searchMin",
				"searchMax",
				"scheduleMin",
				"scheduleMax",
				"scheduleDefault",
			],
			(result) => {
				if (result.searchDesktop != undefined) {
					$searchDesktop.val(result.searchDesktop);
				}
				if (result.searchMobile != undefined) {
					$searchMobile.val(result.searchMobile);
				}
				if (result.scheduleDesktop != undefined) {
					$scheduleDesktop.val(result.scheduleDesktop);
				}
				if (result.scheduleMobile != undefined) {
					$scheduleMobile.val(result.scheduleMobile);
				}
				if (result.searchMin != undefined) {
					$searchMin.val(result.searchMin);
				}
				if (result.searchMax != undefined) {
					$searchMax.val(result.searchMax);
				}
				if (result.scheduleMin != undefined) {
					$scheduleMin.val(result.scheduleMin);
				}
				if (result.scheduleMax != undefined) {
					$scheduleMax.val(result.scheduleMax);
				}
				if (result.scheduleDefault != undefined) {
					deselectAllSchedule();
					if (result.scheduleDefault == "scheduleT1") {
						$scheduleT1.addClass("selected");
						$schedulePerform.text("Never");
					} else if (result.scheduleDefault == "scheduleT2") {
						$scheduleT2.addClass("selected");
						$schedulePerform.text("After startup");
					} else if (result.scheduleDefault == "scheduleT3") {
						$scheduleT3.addClass("selected");
						$schedulePerform.text("Every 5-6 mins");
					} else if (result.scheduleDefault == "scheduleT4") {
						$scheduleT4.addClass("selected");
						$schedulePerform.text("Every 15-17.5 mins");
					}
				} else {
					deselectAllSchedule();
					app.storage.local.set({ scheduleDefault: "scheduleT1" });
					$scheduleT1.addClass("selected");
				}
			},
		);
		console.log("Values fetched, comparing");
		compare();
	}
	fetch();

	function compare() {
		app.storage.local.get([ "searchDesktop", "searchMobile" ], (result) => {
			const searchDesktop = parseInt(result.searchDesktop);
			const searchMobile = parseInt(result.searchMobile);
			console.log(searchDesktop, searchMobile, "values compared");
			deselectAllSearch();
			if (searchDesktop == 15 && searchMobile == 0) {
				$searchT1.addClass("selected");
				console.log("searchT1 selected");
			} else if (searchDesktop == 0 && searchMobile == 16) {
				$searchT2.addClass("selected");
				console.log("searchT2 selected");
			}
			// else if (searchDesktop == 30 && searchMobile == 20) {
			// 	$searchT3.addClass("selected");
			// 	console.log("searchT3 selected");
			// } else if (searchDesktop == 50 && searchMobile == 30) {
			// 	$searchT4.addClass("selected");
			// 	console.log("searchT4 selected");
			// }
		});
	}

	function deselectAllSearch() {
		console.log("Deselected all search");
		$searchT1.removeClass("selected");
		$searchT2.removeClass("selected");
		$searchT3.removeClass("selected");
		$searchT4.removeClass("selected");
	}

	function deselectAllSchedule() {
		console.log("Deselected all schedule");
		$scheduleT1.removeClass("selected");
		$scheduleT2.removeClass("selected");
		$scheduleT3.removeClass("selected");
		$scheduleT4.removeClass("selected");
	}

	function logValues() {
		console.log("searchDesktop", $searchDesktop.val());
		console.log("searchMobile", $searchMobile.val());
		console.log("searchMin", $searchMin.val());
		console.log("searchMax", $searchMax.val());
		console.log("scheduleDesktop", $scheduleDesktop.val());
		console.log("scheduleMobile", $scheduleMobile.val());
		console.log("scheduleMin", $scheduleMin.val());
		console.log("scheduleMax", $scheduleMax.val());
	}

	$searchDesktop.on("input", async function () {
		if ($searchDesktop.val() == "" || $searchDesktop.val() == 0) {
			$searchDesktop.val(0);
		}
		await store();
		logValues();
	});
	$searchMobile.on("input", async function () {
		if ($searchMobile.val() == "" || $searchMobile.val() == 0) {
			$searchMobile.val(0);
		}
		await store();
		logValues();
	});

	$searchPerform.click(async function () {
		console.log(userConsent);
		if (userConsent) {
			await store();
			app.runtime.sendMessage({ message: "search" });
			$stopDiv.css("display", "flex");
		}
	});

	$searchMin.on("input", async function () {
		if (
			parseInt($searchMin.val()) < 20 ||
			parseInt($searchMin.val()) == "" || parseInt($searchMin.val()) == 0
		) {
			$searchMin.val(20);
		}
		if (parseInt($searchMin.val()) >= parseInt($searchMax.val())) {
			$searchMax.val(parseInt($searchMin.val()) + 10);
		}
		await store();
		logValues();
	});
	$searchMax.on("input", async function () {
		if (
			parseInt($searchMax.val()) <= parseInt($searchMin.val()) ||
			parseInt($searchMax.val()) == "" || parseInt($searchMax.val()) == 0
		) {
			$searchMax.val(parseInt($searchMin.val()) + 10);
		}
		await store();
		logValues();
	});

	$searchT1.click(async function () {
		deselectAllSearch();
		$searchT1.addClass("selected");
		$searchDesktop.val(15);
		$searchMobile.val(0);
		console.log("searchT1 clicked, values updated to 15 and 0");
		await store();
		logValues();
	});
	$searchT2.click(async function () {
		deselectAllSearch();
		$searchT2.addClass("selected");
		$searchDesktop.val(0);
		$searchMobile.val(16);
		console.log("searchT2 clicked, values updated to 0 and 16");
		await store();
		logValues();
	});

	$scheduleDesktop.on("input", async function () {
		if ($scheduleDesktop.val() == "") {
			$scheduleDesktop.val(0);
		}
		await store();
		logValues();
	});
	$scheduleMobile.on("input", async function () {
		if ($scheduleMobile.val() == "") {
			$scheduleMobile.val(0);
		}
		await store();
		logValues();
	});

	$scheduleMin.on("input", async function () {
		if (
			parseInt($scheduleMin.val()) < 15 ||
			parseInt($scheduleMin.val()) == ""
		) {
			$scheduleMin.val(15);
		}
		if (parseInt($scheduleMin.val()) >= parseInt($scheduleMax.val())) {
			$scheduleMax.val(parseInt($scheduleMin.val()) + 10);
		}
		await store();
		logValues();
	});
	$scheduleMax.on("input", async function () {
		if (
			parseInt($scheduleMax.val()) <= parseInt($scheduleMin.val()) ||
			parseInt($scheduleMax.val()) == ""
		) {
			$scheduleMax.val(parseInt($scheduleMin.val()) + 10);
		}
		await store();
		logValues();
	});

	$scheduleT1.click(function () {
		deselectAllSchedule();
		$scheduleT1.addClass("selected");
		console.log("scheduleT1 clicked");
		$schedulePerform.text("Schedule updated - Never");
		app.storage.local.set({ scheduleDefault: "scheduleT1" });
		app.runtime.sendMessage({ message: "scheduleUpdate" });
		logValues();
	});
	$scheduleT2.click(function () {
		deselectAllSchedule();
		$scheduleT2.addClass("selected");
		console.log("scheduleT2 clicked");
		$schedulePerform.text("Scheduled for - After startup");
		app.storage.local.set({ scheduleDefault: "scheduleT2" });
		app.runtime.sendMessage({ message: "scheduleUpdate" });
		logValues();
	});
	$scheduleT3.click(function () {
		deselectAllSchedule();
		$scheduleT3.addClass("selected");
		console.log("scheduleT3 clicked");
		$scheduleDesktop.val(1);
		$scheduleMobile.val(1);
		$schedulePerform.text("Start Now - Every 5-6 mins");
		app.storage.local.set({
			scheduleDefault: "scheduleT3",
			scheduleDesktop: 1,
			scheduleMobile: 1,
		});
		app.runtime.sendMessage({ message: "scheduleUpdate" });
		logValues();
	});
	$scheduleT4.click(function () {
		deselectAllSchedule();
		$scheduleT4.addClass("selected");
		console.log("scheduleT4 clicked");
		$scheduleDesktop.val(3);
		$scheduleMobile.val(3);
		$schedulePerform.text("Start Now - Every 15-17.5 mins");
		app.storage.local.set({
			scheduleDefault: "scheduleT4",
			scheduleDesktop: 3,
			scheduleMobile: 3,
		});
		app.runtime.sendMessage({ message: "scheduleUpdate" });
		logValues();
	});

	$schedulePerform.click(function () {
		const content = this.textContent;
		$schedulePerform.text("Schedule updated");
		setTimeout(() => {
			$schedulePerform.text(content);
		}, 2000);
		app.runtime.sendMessage({ message: "schedule" });
	});

	// $device.click(function () {
	// 	app.runtime.sendMessage({ message: "device" });
	// });

	$stop.click(function () {
		app.storage.local.set({ runningSearch: false });
		$stopDiv.css("display", "none");
		app.runtime.sendMessage({ message: "stop" });
	});
});
