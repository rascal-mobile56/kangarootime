var kangarooRoutes = angular.module("kangarooRoutes", [ "ngRoute" ]);
kangarooRoutes.config(function($routeProvider) {
	$routeProvider.when('/whyKangaroo', {
		templateUrl : 'partials/whyKangaroo.html'
	}).when('/signIn', {
		templateUrl : 'partials/signIn.html'
	}).when('/beforeSignIn', {
		templateUrl : 'partials/beforeSignIn.html'
	}).when('/signUp', {
		templateUrl : 'partials/signUp.html'
	}).when('/centerCodeVerified', {
		templateUrl : 'partials/centerCodeVerified.html'
	}).when('/landingPage', {
		templateUrl : 'partials/landingPage.html'
	}).when('/dayCare', {
		templateUrl : 'partials/dayCare.html'
	}).when('/parents', {
		templateUrl : 'partials/parents.html'
	}).when('/whatWeDo', {
		templateUrl : 'partials/whatWeDo.html'
	}).when('/dashboard', {
		templateUrl : 'partials/dashboard.html'
	}).when('/contactUs', {
		templateUrl : 'partials/contactUs.html'
	}).when('/editProfile', {
		templateUrl : 'partials/editProfile.html'
	}).when('/editUserProfile', {
		templateUrl : 'partials/editUserProfile.html'
	}).when('/myMessages', {
		templateUrl : 'partials/myMessages.html'
	}).when('/messageView', {
		templateUrl : 'partials/messageView.html'
	}).when('/newMsg', {
		templateUrl : 'partials/newMsg.html'
	}).when('/replyMsg', {
		templateUrl : 'partials/replyMessage.html'
	}).when('/checkInOut', {
		templateUrl : 'partials/check_in_out.html'
	}).when('/calendar', {
		templateUrl : 'partials/calendar.html'
	}).when('/gallery', {
		templateUrl : 'partials/gallery.html'
	}).when('/settings', {
		templateUrl : 'partials/settings.html'
	}).when('/billing', {
		templateUrl : 'partials/billing.html'
	}).when('/galleryView', {
		templateUrl : 'partials//galleryView.html'
	}).when('/checkInPin', {
		templateUrl : 'partials/Check-in_pin.html'
	}).when('/checkIn', {
		templateUrl : 'partials/check_in.html'
	}).when('/checkOut', {
		templateUrl : 'partials/check_out.html'
	}).when('/calendarEvent', {
		templateUrl : 'partials/calendar_sub.html'
	}).when('/CreateChild', {
		templateUrl : 'partials/Create_Child.html'
	}).when('/EditChild', {
		templateUrl : 'partials/edit_child.html'
	}).when('/ChangePassword', {
		templateUrl : 'partials/change_password.html'
	}).when('/RelationshipProfile', {
		templateUrl : 'partials/relationship_profile.html'
	}).when('/SetPrivilege', {
		templateUrl : 'partials/set_privilege.html'
	}).when('/billingMenus', {
		templateUrl : 'partials/billingMenus.html'
	}).when('/dueAmount', {
		templateUrl : 'partials/due_amount.html'
	}).when('/cardInformation', {
		templateUrl : 'partials/card_information.html'
	}).when('/listChildren', {
		templateUrl : 'partials/list_children.html'
	}).when('/paidAmount', {
		templateUrl : 'partials/paid_amount.html'
	}).when('/listChildReport', {
		templateUrl : 'partials/list_child_report.html'
	}).when('/ReportView', {
		templateUrl : 'partials/report_view.html'
    }).when('/payMyBill', {
        templateUrl : 'partials/pay_mybill.html'
	}).when('/billingACH', {
		templateUrl : 'partials/billing_ach.html'
	}).when('/assessmentChild', {
		templateUrl : 'partials/assessment_child.html'
	}).when('/assessmentList', {
		templateUrl : 'partials/assessment_list.html'
	}).when('/assessmentDetail', {
		templateUrl : 'partials/assessment_detail.html'
	})

	.otherwise({
		redirectTo : '/signIn'
	});

});
