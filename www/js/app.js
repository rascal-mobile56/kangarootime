var kangaroo = angular.module("kangaroo", ['ionic', 'services', 'kangarooRoutes', 'ngStorage', 'ngResource', 'ui.bootstrap', 'ngCordova', 'checklist-model', 'ui.rCalendar']);

kangaroo.run(function ($rootScope, $location, $ionicPopup, $ionicPlatform, login) {

    $rootScope.url = "http://demo.kangarootime.com/";
    $rootScope.url_com = "https://kangarootime.com/";


    $rootScope.INTERNET_DISCONNECT = "Internet Disconnected";
    $rootScope.LOADING_WAIT = 'Loading...';
    $rootScope.INTERNET_CONNECTION_MESSAGE = "Please check network connection on your device.";
    $rootScope.SERVER_ERROR = "Server Error";
    $rootScope.POST = 'POST';
    $rootScope.GET = 'GET';
    var userid = '';

    $rootScope.checkInChildrenData = '';

    $ionicPlatform.ready(function () {


            window.viewMessageHandler = function (notification) {
            window.location.href = "#/messageView?MID=" + notification.additionalData.message_id;
        },

        window.replyMessageHandler = function (notification) {
            window.location.href = "#/replyMsg?MID=" + notification.additionalData.message_id + "&SUB=" + notification.message;
        }
/*
        var push = PushNotification.init({
            "android":
            {
                "senderID": "82359378169",
                "iconColor": "#7e0c6e",
                "icon": "notification"
            },
            "ios":
            {
                "alert": "true",
                "badge": "true",
                "sound": "true"
            },
            "windows": {}
        });

        push.on('registration', function (data) {

            console.log((window.registrationId));
        });

        push.on('notification', function (data) {
            console.log(data.title+"Message: "+data.message);
        });

        PushNotification.hasPermission(function (data) {
            if (!data.isEnabled) {
                //alert('isEnabled = false');
                console.log('isEnabled = false');
            }
        });

        push.on('error', function (e) {
            console.error(e.message);
        });

       */


        var push = PushNotification.init({
            "android":
            {
                "senderID": "783333542272",
                //define('API_ACCESS_KEY', 'AIzaSyAXKdQJBVZKDTn_XxGrbYHbKrWetTr-vmU');
                // "senderID":"783333542272"
                "iconColor": "#7e0c6e",
                "icon": "notification"
            },
            "ios":
            {
                "alert": "true",
                "badge": "true",
                "sound": "true"
            },
            "windows": {}
        });

        push.on('error', function (data) {

            console.log('ERROR: ' + data);
            //alert('EROOR:' + JSON.stringify(data));
        });

        push.on('registration', function(data)
        {
            console.log('cordovaPush.register token : ' + data.registrationId);
            //alert('cordovaPush.register token : ' +JSON.stringify(data.registrationId));

            var token = data.registrationId;
            window.localStorage['device_token'] =  token;
            //alert(window.localStorage['device_token']);
            storeDeviceToken(token);
        });

        push.on('notification', function(notification)
        {
            //alert(JSON.stringify([notification]));
           console.log(JSON.stringify([notification]));
            if (ionic.Platform.isAndroid())
            {
                handleAndroid(notification);
            }
            else if(ionic.Platform.isIOS())
            {
                handleIOS(notification);
            }
        });

        PushNotification.hasPermission(function (data) {
            if (!data.isEnabled) {
                //alert('isEnabled = false');
                console.log('isEnabled = false');
            }
        });

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });


    document.addEventListener('backbutton', function (event) {
        var currentUrl = window.location.hash;
        if (currentUrl == "#/dashboard" || currentUrl == "#/signIn") {
            navigator.app.exitApp();
        } else {
            history.go(-1);
            navigator.app.backhistory();
        }
    });

});


function signInController($scope, $rootScope, $stateParams, $localStorage, $location, login, WebService, LocalStore, $state, $ionicLoading, $cordovaOauth, $q, $http) {
    if (window.localStorage['token'] != undefined) {
        $location.path("/dashboard");
    }

    $rootScope.checkInChildrenData = '';
    $scope.data = {};
    //Facebook login Function
/*
    $scope.loginFB = function () {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        $cordovaOauth.facebook("447073565475718", ["email", "public_profile"]).then(function (result) {
            displayData($http, result.access_token);
            var name = result.data.name;
            var gender = result.data.gender;
            var location = result.data.location;
            var picture = result.data.picture;

        }, function (error) {
            console.log(error);
        });
    };
    function displayData($http, access_token) {
        $http.get("https://graph.facebook.com/v2.2/me", {
            params: {
                access_token: access_token,
                fields: "name,gender,location,picture,email",
                format: "json"
            }
        }).then(function (result) {

            console.log(JSON.stringify(result));
            var name = result.data.name;
            var gender = result.data.gender;
            var location = result.data.location;
            var picture = result.data.picture;
            var id = result.data.id;
            var userid = id;

            var params = {};
            var url = $rootScope.url + '/v1/login_with_social_media?prtovider=facebook&uid=' + userid + '&submit=save';
            var result = WebService.makeServiceCall(url, params, $rootScope.POST);
            result.then(function (response) {

                console.log('' + JSON.stringify(response));
                if (response.status == 200) {
                    window.localStorage['token'] = response.token;
                    $location.path("/dashboard");
                } else {
                    WebService.showAlert(response.message);
                    $location.path("/signIn");
                }
            }, function (response) {
                console.log('' + JSON.stringify(response));
            });
        }, function (error) {
            WebService.showAlert("There was a problem getting your profile.  Check the logs for details.");
            console.log(error);
        });
    }

    $scope.loginGoogle = function () {
        var requestToken = '';
        var accessToken = '';
        var clientId = '1018908884240-futc1bfc681kl2jegi3a7nn1m28aem1o.apps.googleusercontent.com';
        var clientSecret = 'KRQGDwu_llvagUucKM9oLZ7I';
        var deferred = $q.defer();
        $cordovaOauth.google(clientId, ['email']).then(function (result) {
            $localStorage.accessToken = result.access_token;
            deferred.resolve(result.access_token);

            $http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + $localStorage.accessToken, {

                params: {
                    format: 'json'
                }
            }).then(function (result) {
                console.log(JSON.stringify(result));
                var id = result.data.id;
                var params = {};
                var url = $rootScope.url + '/v1/login_with_social_media?prtovider=google_oauth2&uid=' + id + '&submit=save';

                var result = WebService.makeServiceCall(url, params, $rootScope.POST);
                result.then(function (response) {
                    // WebService.showAlert(JSON.stringify(response));
                    console.log('' + JSON.stringify(response));
                    if (response.status == 200) {
                        window.localStorage['token'] = response.token;
                        $location.path("/dashboard");
                    } else {
                        WebService.showAlert(response.message);
                        $location.path("/signIn");
                    }
                }, function (response) {
                    console.log('' + JSON.stringify(response));
                });

                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject({
                    message: 'here was a problem getting your profile',
                    response: error
                });
            });


        }, function (error) {
            deferred.reject({
                message: 'There was a problem signing in',
                response: error
            });
        });
    }
    */


    //Google Login Functions

    $scope.data.email = window.localStorage['user_email'];

    $scope.submit = function (data) {
        if (data.email == '' || data.email == undefined) {
            WebService.showAlert("Please Enter Email");
        } else if (data.password == '' || data.password == undefined) {
            WebService.showAlert("Please enter password");
        } else {
            var params = {
                email: data.email,
                password: data.password,
                registration_id: window.localStorage['device_token']
            };
            console.log(JSON.stringify('device token: '+window.localStorage['device_token']));
            var url = $rootScope.url + 'api/v1/login';
            var result = WebService.makeServiceCall(url, params, $rootScope.POST);
            result.then(function (response) {
                console.log('Result ' + JSON.stringify(response));
                if (response.status == 200) {

                    window.localStorage['user_email'] = data.email;
                    window.localStorage['token'] = response.token;
                    console.log(JSON.stringify(response.token));
                    $location.path("/dashboard");
                } else {
                    WebService.showAlert("Invalid email or password");
                    $location.path("/signIn");
                }
            }, function (response) {
                WebService.showAlert('json data' + JSON.stringify(response));
            });
        }
    };
};

function centerCodeVerifiedController($scope, $http, $rootScope, $location, login, WebService, LocalStore) {
    $scope.data = {};
    $scope.data.centercode = '';
    $scope.centerCodeVerified = function (data) {
        if (data.centercode == '' || data.centercode == undefined) {
            WebService.showAlert("Please enter your Center code");
        } else {
            var params = {center_code: data.centercode};
            var url = $rootScope.url + 'api/v1/center_code_verified';
            var result = WebService.makeServiceCall(url, params, $rootScope.POST);
            result.then(function (response) {
                if (response.status == 200) {
                    window.localStorage['cente_name'] = response.data.center.name;
                    window.localStorage['cente_id'] = response.data.center.id;
                    window.localStorage['center_code'] = response.data.center.center_code;
                    $location.path("/signUp");
                } else if (response.status == 201) {
                    WebService.showAlert(response.data);
                } else {
                    WebService.showAlert("Problem in Center code verification");
                }
            }, function (response) {
                WebService.showAlert('' + JSON.stringify(response));
            });
        }
    };
};


/* Edit Profile of user controler to perform the Edit Profile Api opration and Validations.*/

function editprofileController($scope, $http, $rootScope, $location, WebService, $cordovaImagePicker, $ionicPlatform, $cordovaContacts) {
    $scope.collection = {
        selectedImage: ''
    };
    // $scope.parentImage='/img/uploadimage.png';
    $ionicPlatform.ready(function () {
        window.localStorage['base64'] = '';
        $scope.getImage = function () {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm
                // using only one for this example
                width: 200,
                height: 200,
                quality: 50            // Higher is better
            };
            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.collection.selectedImage = results[i];
                    var extensions = results[i].split('.');
                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function (base64) {
                        window.localStorage['base64'] = base64.replace("*", extensions[extensions.length - 1]);
                        // hit Api to check api Img and Upload image to our server.

                        // var datastring= window.localStorage['base64'].split(',');
                        // var params=
                        // {"datastring":datastring[0],"image":window.localStorage['base64']};
                        // var url="https://imgbase.herokuapp.com/image";
                        // var result=WebService.makeServiceCall(url,params,$rootScope.POST);
                        // result.then(function(response){
                        // alert("Image uploaded please check webpage");
                        // },function(response) {
                            // WebService.showAlert(''+JSON.stringify(response));
                        // });
                        $scope.parentImage = base64;
                        $scope.$apply();
                    });
                }
            }, function (error) {
                console.log('Error: ' + JSON.stringify(error));
            });
        };
        var ParentInfo = $rootScope.parentInfo;
        $scope.data = {};
        $scope.parentName = ParentInfo.username;
        $scope.parentAddress = ParentInfo.address;
        $scope.parentImage = ParentInfo.image;
        $scope.data.name = ParentInfo.username;
        $scope.data.phone = ParentInfo.contact_no;
        $scope.data.address1 = ParentInfo.address1;
        $scope.data.address2 = ParentInfo.address2;
        $scope.data.city = ParentInfo.city;
        $scope.data.state = ParentInfo.state;
        $scope.data.country = ParentInfo.country;
        $scope.data.zip = ParentInfo.zip;
        $scope.profileUpdate = function (data) {
            if (data.name == '' || data.name == undefined) {
                WebService.showAlert("Please enter name");
            } else if (data.phone == '' || data.phone == undefined) {
                WebService.showAlert("Please enter phone number");
            } else if (data.address1 == '' || data.address1 == undefined) {
                WebService.showAlert("Please enter first address");
            } else if (data.city == '' || data.city == undefined) {
                WebService.showAlert("Please enter city name");
            } else if (data.state == '' || data.state == undefined) {
                WebService.showAlert("Please enter State name");
            } else if (data.zip == '' || data.zip == undefined) {
                WebService.showAlert("Please enter zip code");
            } else {
                var params = {
                    parent: {
                        image: window.localStorage['base64'],
                        username: data.name,
                        contact_no: data.phone,
                        address1: data.address1,
                        address2: data.address2,
                        city: data.city,
                        state: data.state,
                        zip: data.zip
                    }
                };
                var url = $rootScope.url + 'api/v1/edit_profile';
                var token = window.localStorage['token'];
                var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
                result.then(function (response) {
                    if (response.status == 200) {
                        WebService.showAlert("Profile updated successfully");
                    } else {
                        WebService.showAlert("Problem in Profile updating");
                    }
                    $location.path("/editProfile");
                }, function (response) {
                    WebService.showAlert('' + JSON.stringify(response));
                });
            }
        };
    });
};

/* Check IN/Out of user to perform the Api opration. */

function CheckInOutController($scope, $http, $rootScope, $location, WebService, LocalStore) {
    $scope.showErrorMessage = false;
    $scope.check_in = function () {
        window.localStorage['checked_in'] = 'false';
        $location.path("/checkInPin");
    };
    $scope.check_out = function () {
        window.localStorage['checked_in'] = 'true';
        $location.path("/checkInPin");
    };
};

/* settingController of user setting page oprations.*/

function settingController($scope, $rootScope, $location, WebService, LocalStore) {
    var params = {};
    var url = $rootScope.url + 'api/v1/settings';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            console.log('setting: '+ JSON.stringify(response));

            if (response.data.ref_parent.length > 0) {
                $scope.hide_Child = "true";
            } else {
                $scope.hide_Child = "false";
            }
        } else {

            WebService.showAlert("Problem in page");
        }

    }, function (response) {
        console.log('setting data' + JSON.stringify(response));
    });
    $scope.showErrorMessage = false;
    $scope.user_name = window.localStorage['user_name'];
    $scope.user_email = window.localStorage['user_email'];
    $scope.parentImage = window.localStorage['user_Image'];
    $scope.check_in = function () {
        window.localStorage['checked_in'] = 'false';
        $location.path("/checkInPin");
    };
    $scope.check_out = function () {
        window.localStorage['checked_in'] = 'true';
        $location.path("/checkInPin");
    };
};
/*
 * Check IN PIN of user to perform the Api opration and Validation.
 */
function CheckInPinController($scope, $http, $rootScope, $location, WebService, CheckInService, CheckOutService, LocalStore) {
    $scope.data = {};
    $scope.data.pin = '';
    $scope.checkIn_Confirm = function (data) {
        if (data.pin == '' || data.pin == undefined) {
            WebService.showAlert("Please enter your Pin");
        } else {
            var params = {pin: data.pin, checked_in: window.localStorage['checked_in']};
            var url = $rootScope.url + 'api/v1/checkin-list';
            var token = window.localStorage['token'];
            var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
            result.then(function (response) {
                if (response.status == 200) {
                    if (window.localStorage['checked_in'] == 'true') {
                        CheckInService.addCheckInList(response.data.children);
                        $location.path("/checkOut");
                    } else {
                        CheckInService.addCheckInList(response.data.children);
                        $location.path("/checkIn");
                    }
                } else if (response.status == 201) {
                    WebService.showAlert(response.data);
                } else {
                    WebService.showAlert("Invalid Pin");
                }
            }, function (response) {
                console.log('' + JSON.stringify(response));
            });
        }
    };
};

/*
 * Check IN of user to perform the Api opration.
 */
function CheckInController($scope, $ionicPopup, $http, $rootScope, $location, WebService, CheckInService) {
    $scope.checkInList = CheckInService.getCheckInList();
    $scope.check_in_yes = function (child, index) {
        var params = {
            center_id: child.center_id,
            parent_id: child.parent_id,
            child_id: child.id,
            checkin: 'yes',
            reason: ''
        };
        var url = $rootScope.url + 'api/v1/checkin_yesno';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
        result.then(function (response) {
            if (response.status == 200) {
                WebService.showAlert('Check in request sent successfully');
                // WebService.showAlert('Sucessfully CheckedIn');
                $scope.checkInList[index].checkin = true;
                $scope.$apply();
            } else {
                WebService.showAlert('Problem in CheckIn');
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });
    };

    $scope.submit = function (child, Region, index) {
        var params = {
            center_id: child.center_id,
            parent_id: child.parent_id,
            child_id: child.id,
            checkin: 'no',
            reason: Region
        };
        var url = $rootScope.url + 'api/v1/checkin_yesno';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
        result.then(function (response) {
            if (response.status == 200) {
                WebService.showAlert('Successfully Submitted');
                $scope.checkInList[index].checkin = true;
                $scope.$apply();
            } else if (response.status == 201) {
                WebService.showAlert(response.data);
            } else {
                WebService.showAlert('Failed to submit ');
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });

    };
    $scope.btn_done = function (child) {
        $location.path("/checkInOut");
    };
};

function CheckOutController($scope, $http, $ionicPopup, $rootScope, $location, WebService, CheckInService) {
    $scope.checkInList = CheckInService.getCheckInList();
    $scope.check_out_yes = function (child, index) {
        var params = {
            center_id: child.center_id,
            parent_id: child.parent_id,
            child_id: child.id,
            checkin: 'yes',
            reason: ''
        };
        var url = $rootScope.url + 'api/v1/checkout_yes';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
        result.then(function (response) {
            if (response.status == 200) {
                $scope.checkInList[index].checkin = false;
                $scope.$apply();
// WebService.showAlert('Sucessfully Checked Out');
                WebService.showAlert('Check out request sent successfully');
            } else {
                WebService.showAlert('Failed to checkout');
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });
    };
    $scope.btn_done = function (child) {
        $location.path("/checkInOut");
    };
};
function changePasswordController($scope, $http, $rootScope, $location, WebService, CheckInService) {
    $scope.data = {};
    $scope.changePassword = function (data) {
        if (data.new_password == '' || data.new_password == undefined) {
            WebService.showAlert("Please enter new password");
        } else if (data.confirm_password == '' || data.confirm_password == undefined) {
            WebService.showAlert("Please enter confirm password");
        } else if (data.new_password != data.confirm_password) {
            WebService.showAlert("Confirm passwords don't match");
        } else {
            $scope.changePassword = function (data) {
                var params = {
                    "parent": {
                        "password": data.new_password,
                        "confirm_password": data.confirm_password
                    }
                };
                var url = $rootScope.url + 'api/v1/change_password';
                var token = window.localStorage['token'];
                var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
                result.then(function (response) {
                    if (response.status == 200) {
                        WebService.showAlert('Password updated successfully');
                        $location.path("/settings");
                    } else {
                        WebService.showAlert('Password not updated');
                    }
                }, function (response) {
                    console.log('' + JSON.stringify(response));
                });
            };
        }
    }
};

function relationShipController($scope, $http, $rootScope, $location, WebService, CheckInService) {
    $scope.data = {};

    $scope.btnRelationship = function (data) {
        if (data.email == '' || data.email == undefined) {
            WebService.showAlert("Please enter email of person you would like to add");
        } else if (!(/^([\w]+(?:\.[\w]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(data.email))) {
            WebService.showAlert("Please enter valid email of person you would like to add");
        }
        // else if(data.relationship==''||data.relationship==undefined){
            // WebService.showAlert("Please enter relationship to account admin details");
        // }
        else {
            var params = {
                parent_invitation: {
                    "invite_parent_email": data.email
                    // ,"invite_parent_rel":data.relationship
                }
            };
            var url = $rootScope.url + 'api/v1/relataionship_invite';
            var token = window.localStorage['token'];
            var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
            result.then(function (response) {
                if (response.status == 200) {
                    // alert("200"+JSON.stringify(response));
                    // WebService.showAlert('Guardian added successfully');
                    WebService.showAlert('Invitation Sent to Guardian successfully');
                    $location.path("/settings");
                } else if (response.status == 201) {
                    // alert("201"+JSON.stringify(response));
                    WebService.showAlert(response.data);
                    $location.path("/settings");
                } else {
                    // alert("haha"+JSON.stringify(response));
                    WebService.showAlert('Invitation not sent to Guardian');
                }
            }, function (response) {
                // alert("error"+JSON.stringify(response));
                console.log('' + JSON.stringify(response));
            });
        }
    };
};

function SetPrivilegeController($scope, $http, $rootScope, $location, WebService, CheckInService) {
    var params = {"type": "refp"};
    var url = $rootScope.url + 'api/v1/ref_parent_list';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
    result.then(function (response) {
        if (response.status == 200) {

            //alert(JSON.stringify(response.status));

            console.log(JSON.stringify(response.data));

            if (response.data.refparent.length) {
                $scope.guardians = response.data.refparent;
            } else {
                $scope.showEmptyText = true;
            }
        }
    }, function (response) {
        console.error('' + JSON.stringify(response));
    });



    $scope.onChange = function (guardian, privilege, value, child_id) {
        var params = {guardian: guardian, privilege: privilege, value: value, child_id: child_id};
        var url = $rootScope.url + 'api/v1/set_privilege';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
        result.then(function (response) {
            if (response.status == 200) {
                console.log(JSON.stringify(params));
                console.log(response.data);
                //WebService.showAlert('Guardian Privileges Updated Successfully');
            } else {
                WebService.showAlert('Guardian Privileges not updated');
            }
        }, function (response) {
            console.error('There was an error saving the settings.');
        });
    };
};

/* DashBord page controler to perform the Api opration and Validation.*/

function dashbordController($scope, $http, $rootScope, $templateCache, $window, $location, profile, login, LocalStore, WebService, AllEventService) {
    var params = {};
    $scope.data = {};

    $scope.data.value = window.localStorage['user_name'];
    // alert($scope.data.value);
    var url = $rootScope.url + 'api/v1/parent_profile';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            // window.localStorage.getItem['parent_profile_data']=response.data;
            window.localStorage['parent_id'] = response.data.parent_id;
            window.localStorage['center_id'] = response.data.center_id.$oid;
            // alert("Center: "+window.localStorage['center_id']+" "+"Parent
            // Id:"+window.localStorage['parent_id']);
            window.localStorage['user_email'] = response.data.email;
            window.localStorage['user_name'] = response.data.username;
            window.localStorage['user_address'] = response.data.address;
            window.localStorage['user_Image'] = response.data.image;
            $scope.name = response.data.username;
            $scope.address = response.data.address;
            $scope.userImage = response.data.image;
            // $scope.name=window.localStorage['user_name'];
            // $scope.address=window.localStorage['user_address'];
            // $scope.userImage=window.localStorage['user_Image'];

            // Menu visibilte according to user.
            $scope.messages = response.data.messages;
            $scope.check_inout = response.data.check_inout;
            $scope.assessment = response.data.assessment;

            $scope.calendar = response.data.calendar;
            $scope.billing = response.data.billing;
            $scope.gallery = response.data.gallery;
        } else {
            WebService.showAlert("Invalid request");
        }

    }, function (response) {
        console.log('' + JSON.stringify(response));
    });

    $scope.logout = function () {
        login.logout(window.localStorage['token']).success(function (data) {
            var localemail = window.localStorage['user_email'];
            localStorage.clear();
            window.localStorage['user_email'] = localemail;

            $location.path("/");
            // for(var i=0;i<$window.history.length;i++){
                // $window.history.back();
            // }
        }).error(function (data, status, headers, config) {
            localStorage.clear();


            // for(var i=0;i<$window.history.length;i++){
                // $window.history.back();
            // }
            $location.path("/");
        });
    };

};


function billingMenuController($scope, $http, $rootScope, $location, contactUs, WebService) {
    $scope.achInformation = function () {
        $location.path("/billingACH");
    };
    $scope.cardInformation = function () {
        var params = {};
        var url = $rootScope.url + 'api/v1/new_cardinfo';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {

            if (response.status == 200) {

                console.log(response.data);

                if (response.data.hasOwnProperty('card_hash')) {
                    $location.path("/billing");
                    // /billingMenus
                    window.localStorage.getItem['user_card_hash'] = response.data.card_hash;
                } else if (response.data.hasOwnProperty('card_info')) {
                    $location.path("/cardInformation");
                    window.localStorage.getItem['user_card_info'] = response.data.card_info;
                }
            }
        }, function (response) {
            alert("error" + JSON.stringify(response));
            console.log('' + JSON.stringify(response));
        });
    };
    $scope.amountPaid = function () {
        $location.path("/paidAmount");
    };
    $scope.amountDue = function () {
        $location.path("/listChildren");
    };
    $scope.payMyBill = function () {
        $location.path("/payMyBill");
    };
    $scope.Report = function () {
        $location.path("/listChildReport");
    };
};


function billingACHController($scope, $sce, $http, $rootScope, $location, contactUs, WebService) {
    var params = {};

    $scope.customUrl = $sce.trustAsResourceUrl($rootScope.url + 'ach_card_new?center_id=' + window.localStorage['center_id'] + '&parent_id=' + window.localStorage['parent_id']);
    console.log('$scope.customUrl' + $scope.customUrl);

   /*
    var url=$rootScope.url + 'api/v1/ach_details';
    var token = window.localStorage['token'];
    var result=WebService.makeServiceCallHeader(url,params,$rootScope.GET,token);
    result.then(function(response){
        if (response.status == 200) {
            var hash_value=response.data.card_hash.hash;
            var seed_value=response.data.card_hash.seed;
            var net_amt=response.data.card_hash.net_amt;
            $scope.customUrl =
                $sce.trustAsResourceUrl($rootScope.url_com + 'ach_card_new?center_id=56403a2e69702d4c15000000&parent_id=56403c1e69702d4c15010000');
        }
    },function(response) {
        console.log(''+JSON.stringify(response));
    });

    */

    window.checkIframeUrl = function (curentUrl) {
    console.log("Current ACh Page : "+curentUrl);
    };
    // $scope.customUrl =
    // $sce.trustAsResourceUrl('https://sandbox.axiaepay.com/interface/epayform/_vf7zTwe2eVr2XnhMyJCLWke600f0595/?UMcommand=check:sale&amp;UMamount=4.0&amp;UMinvoice=12345&amp;UMhash=s/1447756951.1788719/85287e86d798fbd612a537e23a620b2c9bc4ab8d/n&amp;UMechofields=all&amp;UMsaveCard=true&amp;UMredirApproved=http://testing.kangarootime.com/ach_save&amp;UMredirDeclined=http://testing.kangarootime.com/ach_save');
};



function cardInfoController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var user_info = window.localStorage.getItem['user_card_info'];
    $scope.parentImage = window.localStorage['user_Image'];
    $scope.parent_name = user_info.parent_name;
    $scope.center_name = user_info.center_name;
    $scope.card_no = user_info.card_no;
    $scope.card_type = user_info.card_type;

};

function listChildReportController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var params = {};
    var url = $rootScope.url + 'api/v1/child_list';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            $scope.listChild = response.data.children;
        }
        else if (response.status == 201) {
            $scope.noData = "true";
            $scope.message = response.data;
        }
    }, function (response) {
        console.log('' + JSON.stringify(response));

    });
    $scope.clickChild = function (child) {

        window.localStorage.getItem['Selected_Child'] = child;
        $location.path("/ReportView");
    }
};


function reportViewController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var child = window.localStorage.getItem['Selected_Child'];
    var params = {child_id: child.id};
    // var params={child_id:"5656bc3d69702d0d64010000"};
    var url = $rootScope.url + 'api/v1/all_report';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
    result.then(function (response) {

        if (response.status == 200) {
            $scope.Reports = response.data.reports;
        } else if (response.status == 201) {

            $scope.no_detail_Message = "No Transaction Found";
            $scope.hideDetailView = "true";
        }
    }, function (response) {

        console.log('' + JSON.stringify(response));
    });
};


function listChildController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var params = {};
    var url = $rootScope.url + 'api/v1/invoices';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            //alert("invoice:" + JSON.stringify(response));
            $scope.listChild = response.data.invoices;
            $scope.listChild = response.data.invoices;

            for(var m = 0; m<response.data.invoices.length; m++)
            {
                var date= new Date(response.data.invoices[m].date);
                var date1= date.toISOString("MM/dd/yy").split('T')[0];
                $scope.listChild[m].date = date1.split('-')[1] + '/' +date1.split('-')[2] +'/'+date1.split('-')[0];

            }
        }
        else if (response.status == 201) {
            //alert("invoice:" + JSON.stringify(response.status));
            $scope.noData = "true";
            $scope.message = response.data;
        }
    }, function (response) {
        //alert("invoice:" + JSON.stringify(response.status));
        console.log('' + JSON.stringify(response));

    });
    $scope.clickInvoice = function (invoices) {

        window.localStorage.getItem['Selected_Invoice'] = invoices;
        $location.path("/dueAmount");

    }
};

function listAssessmentsChilds($scope, $http, $rootScope, $location, contactUs, WebService) {
    var params = {};
    var url = $rootScope.url + 'api/v1/child_list';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {
            $scope.listChild = response.data.children;
            // alert(JSON.stringify(response.data.children));
        }
        else if (response.status == 201) {
        // alert("201"+JSON.stringify(response));
        // alert("201"+JSON.stringify(response.data.children));
            $scope.noData = "true";
            $scope.message = response.data;
        }
    }, function (response) {
        // alert("error"+JSON.stringify(response.data.children));
        console.log('' + JSON.stringify(response));

    });
    $scope.clickChild = function (child) {
        window.localStorage.getItem['Selected_Child'] = child;
        $location.path("/assessmentList");

    }
};

function AssessmentsList($scope, $http, $rootScope, $location, contactUs, WebService) {

    $scope.assignList = [];
    $scope.showAssessment = function (assessment) {
    //alert("assessment"+JSON.stringify(assessment));
        window.localStorage.getItem['Selected_Assessment'] = assessment;

        $location.path("/assessmentDetail");
    }
    var child = window.localStorage.getItem['Selected_Child'];
    var params = "";
    var url = $rootScope.url + 'api/v1/assessments_list?child_id=' + child.id;
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            var myList = [];
            var str;
            var results = [];
            $scope.noDataToShow = "false";
            $scope.childname= response.data.assessment[0].child_name;

            // alert( response.data.assessment.length);
            for (var i = 0; i < response.data.assessment.length; i++) {

                var assign = {};
                assign.id = response.data.assessment[i].id;
                // assign.child_name = response.data.assessment[i].child_name;

                var date =new Date(response.data.assessment[i].date.split("(")[0]);
                assign.date = date.toDateString("MM/dd/yyyy");

                str = response.data.assessment[i].description.replace(/#|&|13|;|,|_/g, '');

                assign.description = str;
                // alert(JSON.stringify(response.data.assessment[i].description));
                myList.push(assign);
                // alert(JSON.stringify(assignList));
            }
            $scope.assignList = myList;
            // alert("push list"+JSON.stringify(assignList));

        } else if (response.status == 201) {
            $scope.noDataToShow = "true";
        } else {
            $scope.noDataToShow = "true";
        }
    }, function (response) {
        console.log('' + JSON.stringify(response));

    });

};

function AssessmentDetailController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var id = window.localStorage.getItem['Selected_Assessment'].id;
    var child = window.localStorage.getItem['Selected_Child'];
    // alert(child.id+"child"+JSON.stringify(child));
    var params = "";
    var url = $rootScope.url + 'api/v1/assessments_details?id=' + id;
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            // alert("200"+JSON.stringify(response));
            $scope.noDataToShow = "false";
            $scope.assessment = response.data.assesment;
            $scope.date = response.data.assesment.date;

            var aa = response.data.assesment.description.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
            var str = '';
            for (var k = 0; k < aa.length; k++) {
                str += aa[k] + '<br>';
            }
            $scope.description = str;

        } else if (response.status == 201) {
            // alert("201"+JSON.stringify(response));
            $scope.noDataToShow = "true";
        } else {
            // alert("else"+JSON.stringify(response));
            $scope.noDataToShow = "true";
        }
    }, function (response) {
        console.log('' + JSON.stringify(response));

    });

};

function duoAmountController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var invoices = window.localStorage.getItem['Selected_Invoice'];
    $scope.data = {};
    var params = {invoice_id: invoices.id};
    var url = $rootScope.url + 'api/v1/due_amount';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
    result.then(function (response) {
        //$scope.child = child;
        if (response.status == 200) {

            // "card_info":{"id":null,
            //     "balance_id":2,
            //     "balance":"$3190.35",
            //     "parent_name":"Anna Six",
            //     "plan":"","center_name":"Kelly's Childcare Center",
            //     "child_name":"",
            //     "card_info":"true",
            //     "ach_info":"true",
            //     "past_due_amt":"0.0"

            //alert("due_amount:" + JSON.stringify(response.data));

            $scope.child_id = params.invoice_id;

            //$scope.child_name = response.data.card_info.child_name;
            $scope.center_name = response.data.card_info.center_name;
            //$scope.plan = response.data.card_info.plan;
            var valueInfo = response.data.card_info.balance.split('$');
            $scope.duo_amount = valueInfo[1];
            $scope.data.anyAmount = valueInfo[1];
            if (response.data.card_info.balance == "0.0") {
                // $scope.PayBtnAch=true;
                // $scope.PayBtnCard=true;
                $scope.message = "No Due Amount";
            } else {
                $scope.message = "Please Pay Now";
            }

            // alert(response.data.card_info.card_info);
            if (response.data.card_info.card_info == "false") {
                // alert(response.data.card_info.card_info);
                $scope.PayBtnCard = true;
            } else {
                // alert(response.data.card_info.card_info);
                $scope.PayBtnCard = false;
            }
            if (response.data.card_info.ach_info == "false") {
                $scope.PayBtnAch = true;
            } else {
                $scope.PayBtnAch = false;
            }
            // alert("Data Responce:"+JSON.stringify(response.data));

        } else if (response.status == 201) {
            $scope.noData = "true";
            $scope.duo_amount = "00.00";
            $scope.no_Amount_Message = "No Due Amount Details Found";
            $scope.hidePayBtn = "true";
        }
    }, function (response) {
        $scope.hidePayBtn = "true";
//        alert("respons"+JSON.stringify(response));
        console.log('' + JSON.stringify(response));
    });
    $scope.clickChild = function (child) {
        window.localStorage.getItem['Selected_Child'] = child;
        // alert("click:"+JSON.stringify(window.localStorage.getItem['Selected_Child']));
        $location.path("/dueAmount");

    }

    $scope.payNowAch = function (data) {

        var amountPayable = JSON.stringify(data.anyAmount);
        var params = "";
        //alert(JSON.stringify($scope.child_id));
        var url = $rootScope.url + 'api/v1/pay_now?child_id=' + $scope.child_id + '&amt=' + amountPayable + '&type=ACH';
        console.log('' + url);
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {
            //alert(JSON.stringify(response));
            if (response.status == 200) {
                WebService.showAlert('Your Payment has been submitted successfully');
                // $location.path("/billing");
            } else {
                WebService.showAlert("Transaction failed. Please try again!!!");
            }
        }, function (response) {

            WebService.showAlert("Connect failed. Please try again!!!");
            console.log('' + JSON.stringify(response));
        });
    }


    $scope.payNowCard = function (data) {
        var amountPayable = JSON.stringify(data.anyAmount);
        var params = "";
        var url = $rootScope.url + 'api/v1/pay_now?child_id=' +  $scope.child_id + '&amt=' + amountPayable + '&type=CARD';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {

            //alert(JSON.stringify(response));
            if (response.status == 200) {
                WebService.showAlert('Your Payment has been submitted successfully');
                // $location.path("/billing");
            } else {
                WebService.showAlert("Transaction failed. Please try again!!!");
            }
        }, function (response) {

            alert('error');
            console.log('' + JSON.stringify(response));
        });
    }
};

function payMyBillController($scope, $http, $rootScope, $location, contactUs, WebService) {

    var invoices = window.localStorage.getItem['Selected_Invoice'];
    $scope.data = {};
    //var params = {invoice_id: invoices.id};
    var params = {};
    var url = $rootScope.url + 'api/v1/due_amount';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
    result.then(function (response) {
        //$scope.child = child;
        if (response.status == 200) {

            console.log("due_amount:" + JSON.stringify(response.data));

            $scope.child_id = params.invoice_id;

            //$scope.child_name = response.data.card_info.child_name;
            $scope.center_name = response.data.card_info.center_name;
            //$scope.plan = response.data.card_info.plan;
            var valueInfo = response.data.card_info.balance.split('$');
            $scope.duo_amount = valueInfo[1];
            $scope.data.anyAmount = valueInfo[1];
            if (response.data.card_info.balance == "0.0") {
                // $scope.PayBtnAch=true;
                // $scope.PayBtnCard=true;
                $scope.message = "No Due Amount";
            } else {
                $scope.message = "Please Pay Now";
            }

            // alert(response.data.card_info.card_info);
            console.log('Card_Info: ' + response.data.card_info.card_info);
            if (response.data.card_info.card_info == "false") {
                $scope.PayBtnCard = true;
            } else {
                $scope.PayBtnCard = false;
            }
            if (response.data.card_info.ach_info == "false") {
                $scope.PayBtnAch = true;
            } else {
                $scope.PayBtnAch = false;
            }

        } else if (response.status == 201) {
            $scope.noData = "true";
            $scope.duo_amount = "00.00";
            $scope.no_Amount_Message = "No Due Amount Details Found";
            $scope.hidePayBtn = "true";
        }
    }, function (response) {
        $scope.hidePayBtn = "true";
//        alert("respons"+JSON.stringify(response));
        console.log('HIdePayBTN: ' + JSON.stringify(response));
    });
    $scope.clickChild = function (child) {
        window.localStorage.getItem['Selected_Child'] = child;
        // alert("click:"+JSON.stringify(window.localStorage.getItem['Selected_Child']));
        console.log("click:"+JSON.stringify(window.localStorage.getItem['Selected_Child']));
        $location.path("/dueAmount");

    }

    $scope.payNowAch = function (data) {

        var amountPayable = JSON.stringify(data.anyAmount);
        var params = "";
        //alert(JSON.stringify($scope.child_id));
        var url = $rootScope.url + 'api/v1/pay_now?child_id=' + $scope.child_id + '&amt=' + amountPayable + '&type=ACH';
        console.log('' + url);
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {
            //alert(JSON.stringify(response));
            if (response.status == 200) {
                WebService.showAlert('Your Payment has been submitted successfully');
                // $location.path("/billing");
            } else {
                WebService.showAlert("Transaction failed. Please try again!!!");
            }
        }, function (response) {

            WebService.showAlert("Connect failed. Please try again!!!");
            console.log('' + JSON.stringify(response));
        });
    }


    $scope.payNowCard = function (data) {
        var amountPayable = JSON.stringify(data.anyAmount);
        var params = "";
        var url = $rootScope.url + 'api/v1/pay_now?child_id=' +  $scope.child_id + '&amt=' + amountPayable + '&type=CARD';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {

            //alert(JSON.stringify(response));
            if (response.status == 200) {
                WebService.showAlert('Your Payment has been submitted successfully');
                // $location.path("/billing");
            } else {
                WebService.showAlert("Transaction failed. Please try again!!!");
            }
        }, function (response) {

            alert('error');
            console.log('' + JSON.stringify(response));
        });
    }
};

function paidAmountController($scope, $http, $rootScope, $location, contactUs, WebService) {
    var params = {};
    var url = $rootScope.url + 'api/v1/paid_amount';
    var token = window.localStorage['token'];
    var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
    result.then(function (response) {
        if (response.status == 200) {

            //alert(JSON.stringify(response));
            $scope.AllTransection = [];
            //var allTransections = [];
            for (var i = 0; i < response.data.length; i++) {
                var obj = response.data[i];
                for (var key in obj) {
                    var arrObj = obj[key];
                    for (var j = 0; j < arrObj.length; j++) {
                        $scope.AllTransection.push(arrObj[j]);
                    }
                }
            }
        }
        else if (response.status == 201) {
            $scope.noData = "true";
            $scope.message = response.data;
        }
    }, function (response) {
        console.log('' + JSON.stringify(response));
    });
};

function billingController($scope, $sce, $http, $rootScope, $location, contactUs, WebService) {
    $scope.data = {};
    // alert($rootScope.url_com + 'axia-card-new?center_id='+window.localStorage['center_id']+'&parent_id='+window.localStorage['parent_id']);
    $scope.customUrl = $sce.trustAsResourceUrl($rootScope.url_com + 'axia-card-new?center_id=' + window.localStorage['center_id'] + '&parent_id=' + window.localStorage['parent_id']);
    console.log('$scope.customUrl axis card:' + $scope.customUrl);


    // alert("contoler");
    // Api to get the value of seed and hash.
    // var params={};
    // var hash_Value;
    // var seed_Value;
    // var url=$rootScope.url + 'api/v1/new_cardinfo';
    // var token = window.localStorage['token'];
    // var result=WebService.makeServiceCallHeader(url,params,$rootScope.GET,token);
    // result.then(function(response){
    // if (response.status == 200) {
        // hash_Value=response.data.card_hash.hash;
        // seed_Value=response.data.card_hash.seed;
    // } else {
         // WebService.showAlert("Problem in loading Page");
    // }
// },function(response) {
    // console.log(''+JSON.stringify(response));
    // });
    window.checkIframeUrl = function (curentUrl) {

        //$window.location.reload(true);
        //$scope.customUrl=curentUrl;
        //$location.path("/assessmentList");
        //$scope.customUrl = $sce.trustAsResourceUrl($rootScope.url + 'axia-card-new?center_id='+window.localStorage['center_id']+'&parent_id='+window.localStorage['parent_id']);
        //$scope.$apply();
        //alert("Page: "+curentUrl);

    };
};
function contactUsController($scope, $http, $rootScope, $location,WebService, contactUs) {
    $scope.showErrorMessage = false;
    $scope.submit = function () {
        if (!(/^([\w]+(?:\.[\w]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test($scope.email))) {
            $scope.showErrorMessage = true;
        } else {
            $scope.showErrorMessage = false;
            contactUs.contact($scope.name, $scope.email, $scope.phone, $scope.info).success(function (data) {
                WebService.showAlert("Mail Successfully Sent");
            });
        }
    };
};

function calendarController($scope, $http, $rootScope, $location, contactUs, WebService, AllEventService) {
    'use strict';
    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    };

    $scope.today = function () {
        $scope.currentDate = new Date();
    };

    $scope.isToday = function () {
        var today = new Date(),
            currentCalendarDate = new Date($scope.currentDate);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

    $scope.loadEvents = function () {
        var params = {type: 'event'};
        var url = $rootScope.url + 'api/v1/list_event';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
        result.then(function (response) {
            if (response.status == 200) {
                AllEventService.addAllEvent(response.data.event);
                $scope.eventSource = createRandomEvents(response.data.event);
            } else if (response.status == 201) {
                WebService.showAlert(response.data);
            } else {
                WebService.showAlert('Problem in Loading calendar events');
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });
// $scope.eventSource = createRandomEvents(AllEventService.getAllEvent());
    };
    $scope.onEventSelected = function (event) {
        $scope.event = event;
    };
    function createRandomEvents(allEvents) {
        var events = [];
        for (var i = 0; i < allEvents.length; i += 1) {
            var month = allEvents[i].starts_at.split('/')[0] - 1;
            var day = allEvents[i].starts_at.split('/')[1];
            var year = allEvents[i].starts_at.split('/')[2];

            var startHours = allEvents[i].starts_time.split(':')[0];
            var startMints = allEvents[i].starts_time.split(':')[1].split(' ')[0];

            var date = new Date();
            var startTime;
            var endTime;
            startTime = new Date(year, month, day, parseInt(startHours), parseInt(startMints));
            endTime = new Date(year, month, day, parseInt(startHours), parseInt(startMints));
            events.push({
                title: allEvents[i].title,
                startTime: startTime,
                endTime: endTime,
                id: allEvents[i].id,
                allDay: false
            });
        }
        return events;
    };
    $scope.eventSelected = function () {
    };
};

function monthCalendarController($scope, $http, $rootScope, $filter, $location, WebService, CalendarEventService) {
    $scope.eventSelected = function (event) {
        var params = {id: event.event.id};
        var url = $rootScope.url + 'api/v1/show_event';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
        result.then(function (response) {
            if (response.status == 200) {
                CalendarEventService.addEvent(response.data.event);
                //alert("contorller");
                $location.path("/calendarEvent");
            } else {
                WebService.showAlert('Problem in Loading');
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });
    };
    $scope.selectDate = function (date) {
        $scope.selectedDate = date.date;
        $scope.showEventsDiv = true;
    };
};
function calendarEventController($scope, $rootScope, $location, CalendarEventService) {
    var str;
    var Event = CalendarEventService.getEvent();
    var Start_date = Event.starts_at.split('/');
    //$scope.eventMonth="Jan";
    $scope.eventDate = Start_date[1];
    $scope.eventTitle = Event.title;
    $scope.eventCenter = "Center Name";
    $scope.eventStarts_at = Event.starts_at;
    $scope.eventStarts_time = Event.starts_time;
    str = Event.description.replace(/#|&|13|;|,|_/g, '');
    $scope.eventDescription = str;
    //alert(Event.description);
    if (Start_date[0] == "1") {
        $scope.eventMonth = "Jan";
    } else if (Start_date[0] == "2") {
        $scope.eventMonth = "Feb";
    } else if (Start_date[0] == "3") {
        $scope.eventMonth = "Mar";
    } else if (Start_date[0] == "4") {
        $scope.eventMonth = "Apr";
    } else if (Start_date[0] == "5") {
        $scope.eventMonth = "May";
    } else if (Start_date[0] == "6") {
        $scope.eventMonth = "Jun";
    } else if (Start_date[0] == "7") {
        $scope.eventMonth = "Jul";
    } else if (Start_date[0] == "8") {
        $scope.eventMonth = "Aug";
    } else if (Start_date[0] == "9") {
        $scope.eventMonth = "Sep";
    } else if (Start_date[0] == "10") {
        $scope.eventMonth = "Oct";
    } else if (Start_date[0] == "11") {
        $scope.eventMonth = "Nov";
    } else if (Start_date[0] == "12") {
        $scope.eventMonth = "Dec";
    } else {
        $scope.eventMonth = Start_date[0];
    }

};

/*
 * Signup controler to perform the SignUp Api opration and Validations.

function CreateChildController($scope, $cordovaDatePicker, $filter, $http, $rootScope, $location, WebService, LocalStore, $cordovaImagePicker, $ionicPlatform, $cordovaContacts) {
    $scope.collection = {
        selectedImage: ''
    };
    $ionicPlatform.ready(function () {
        window.localStorage['childbase64'] = '';
        // ------------------------------------------------------
        var params = {};
        var url = $rootScope.url + 'api/v1/new_child';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {
            if (response.status == 200) {
                $scope.AllPlans = response.data.plan;
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });
        // -----------------------------------------------------
        $scope.getImageSaveContact = function () {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm
                // using only one for this example
                width: 200,
                height: 200,
                quality: 50            // Higher is better
            };
            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.collection.selectedImage = results[i];
                    var extensions = results[i].split('.');
                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function (base64) {
                        // alert(base64.replace("*",extensions[extensions.length-1]));
                        window.localStorage['childbase64'] = base64.replace("*", extensions[extensions.length - 1]);
                        $scope.parentImage = base64;
                        $scope.$apply();
                    });
                }
            }, function (error) {
                console.log('Error: ' + JSON.stringify(error));
            });
        };
        $scope.data = {};
        $scope.data.First_Name = '';
        $scope.data.Middle_Name = '';
        $scope.data.Last_Name = '';
        $scope.data.Birth_City = '';
        $scope.data.Birth_Country = '';
        $scope.data.Street_Address = '';
        // $scope.data.child_relation='';
        $scope.data.State = '';
        $scope.data.zip_code = '';
        $scope.data.Country = '';
        $scope.data.sex = '';
        $scope.data.plan = '';
        $scope.data.birthday = '';
        var dateSelected = '';
        if (dateSelected == '') {
            dateSelected = $filter('date')(new Date(), "MM-dd-yyyy");
            $scope.data.birthday = "Date of Birth *";
        }
        $scope.selectDate = function () {
            var options = {
                date: new Date(dateSelected),
                mode: 'date', // or 'time'
                maxDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };

            $cordovaDatePicker.show(options).then(function (date) {
                dateSelected = $filter('date')(date, "MM-dd-yyyy");
                $scope.data.birthday = $filter('date')(date, "MM-dd-yyyy");
            });

            // ----------------------------------------

        };
        $scope.createChild = function (data) {
            var curentDate = $filter('date')(new Date(), "dd-MM-yyyy");
            var bithDate = $filter('date')(data.birthday, "dd-MM-yyyy");
            if (data.First_Name == '' || data.First_Name == undefined) {
                WebService.showAlert("Please enter First Name");
            } else if (data.Last_Name == '' || data.Last_Name == undefined) {
                WebService.showAlert("Please enter Last Name");
            } else if (data.Birth_City == '' || data.Birth_City == undefined) {
                WebService.showAlert("Please enter Birth City");
            } else if(data.Birth_Country==''||data.Birth_Country==undefined){
                WebService.showAlert("Please enter Birth Country ");
            }else if (data.Street_Address == '' || data.Street_Address == undefined) {
                WebService.showAlert("Please enter Street Address");
            } else if(data.child_relation==''||data.child_relation==undefined){
                WebService.showAlert("Please enter Relation with child");
            } else if (data.State == '' || data.State == undefined) {
                WebService.showAlert("Please enter State");
            } else if (data.zip_code == '' || data.zip_code == undefined) {
                WebService.showAlert("Please enter Zip Code");
            } else if (data.zip_code.length == 6) {
                WebService.showAlert("Please enter Valid Zip Code");
            } else if(data.Country==''||data.Country==undefined){
            WebService.showAlert("Please enter Country");
            } else if (data.birthday == "Date of Birth *") {
                WebService.showAlert("Please enter Date of Birth ");
            } else if( data.sex==''|| data.sex==undefined){
            WebService.showAlert("Please Select child sex");
            } else if( data.plan==''|| data.plan==undefined){
            WebService.showAlert("Please Select Payment Plan");
            }
            else {
                var bithDate = $filter('date')(data.birthday, "dd-MM-yyyy");
                var url = $rootScope.url + 'api/v1/add_child';
                var base64String = window.localStorage['childbase64'];
                var params = {
                    child: {
                        image: base64String,
                        first_name: data.First_Name,
                        middle_name: data.Middle_Name,
                        last_name: data.Last_Name,
                        city: data.Birth_City,
                        state: data.State,
                        zip: data.zip_code,
                        country: data.Birth_Country,
                        birthday: bithDate,
                        sex: data.sex,
                        plan_id: data.plan
                    }
                };
                var token = window.localStorage['token'];
                var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
                result.then(function (response) {
                    if (response.status == 200) {
                        $location.path("/settings");
                        WebService.showAlert("Child Created sucessfully");
                    } else {
                        WebService.showAlert("Problem in Creating Child");
                    }
                }, function (response) {
                    WebService.showAlert('' + JSON.stringify(response));
                });
            }
        };
    });
};

 */
// -----------------------------------------------------------------------------------------
function EditChildController($scope, $cordovaDatePicker, $filter, $http, EditChildService, $rootScope, $location, WebService, LocalStore, $cordovaImagePicker, $ionicPlatform, $cordovaContacts) {

    $scope.collection = {
        selectedImage: ''
    };
    $ionicPlatform.ready(function () {
        window.localStorage['childImagebase64'] = '';
        // ------------------------------------------------------
        var params = {};
        var url = $rootScope.url + 'api/v1/new_child';
        var token = window.localStorage['token'];
        var result = WebService.makeServiceCallHeader(url, params, $rootScope.GET, token);
        result.then(function (response) {
            if (response.status == 200) {
                $scope.AllPlans = response.data.plan;
            }
        }, function (response) {
            console.log('' + JSON.stringify(response));
        });
        // -----------------------------------------------------
        $scope.getImageSaveContact = function () {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm
                // using only one for this example
                width: 200,
                height: 200,
                quality: 50            // Higher is better
            };
            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.collection.selectedImage = results[i];
                    var extensions = results[i].split('.');
                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function (base64) {
                        window.localStorage['childImagebase64'] = base64.replace("*", extensions[extensions.length - 1]);
                        $scope.childImage = base64;
                        $scope.$apply();
                    });
                }
            }, function (error) {
                console.log('Error: ' + JSON.stringify(error));
            });
        };
        var childDetail = EditChildService.getChildDetail();
        $scope.data = {};
        $scope.childImage = childDetail.image;
        $scope.data.First_Name = childDetail.first_name;
        $scope.data.Middle_Name = '';
        $scope.data.Last_Name = childDetail.last_name;
        $scope.data.Birth_City = childDetail.city;
        $scope.data.Birth_Country = childDetail.country;
        $scope.data.Street_Address = childDetail.street;
        // $scope.data.child_relation=childDetail.relation;
        $scope.data.State = childDetail.state;
        $scope.data.zip_code = childDetail.zip;
        $scope.data.Country = childDetail.country;
        $scope.data.birthday = childDetail.birthday;
        $scope.data.sex = childDetail.sex;
        $scope.data.plan = childDetail.plan;
        if (childDetail.sex) {
            $scope.data.sex = 'True';
        } else {
            $scope.data.sex = 'false';
        }
        $scope.selectDate = function () {
            var options = {
                date: new Date($scope.data.birthday),
                mode: 'date', // or 'time'
                maxDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };
            $cordovaDatePicker.show(options).then(function (date) {
                $scope.data.birthday = $filter('date')(date, "MM-dd-yyyy");
            });
            // ----------------------------------------
        };
        $scope.createChild = function (data) {
            var curentDate = $filter('date')(new Date(), "MM-dd-yyyy");
            var bithDate = $filter('date')(data.birthday, "Mm-dd-yyyy");
            if (data.First_Name == '' || data.First_Name == undefined) {
                WebService.showAlert("Please enter first name");
            } else if (data.Last_Name == '' || data.Last_Name == undefined) {
                WebService.showAlert("Please enter last name");
            } else if (data.Birth_City == '' || data.Birth_City == undefined) {
                WebService.showAlert("Please enter birth city");
            } else if (data.Street_Address == '' || data.Street_Address == undefined) {
                WebService.showAlert("Please enter street address");
            } else if (data.State == '' || data.State == undefined) {
                WebService.showAlert("Please enter state name");
            } else if (data.zip_code == '' || data.zip_code == undefined) {
                WebService.showAlert("Please enter zip/postal code");
            } else if (data.zip_code.length == 6) {
                WebService.showAlert("Please enter Valid zip/postal Code");
            } else {
                 bithDate = $filter('date')(data.birthday, "dd-MM-yyyy");
                var url = $rootScope.url + 'api/v1/edit_child';
                var base64String = window.localStorage['childImagebase64'];
                var params = {
                    child_id: childDetail.id,
                    child: {
                        image: base64String,
                        first_name: data.First_Name,
                        middle_name: data.Middle_Name,
                        last_name: data.Last_Name,
                        city: data.Birth_City,
                        state: data.State,
                        zip: data.zip_code,
                        country: data.Birth_Country,
                        birthday: bithDate,
                        sex: data.sex,
                        plan: data.plan
                    }
                };
                console.log('params ' + JSON.stringify(params));
                var token = window.localStorage['token'];
                var result = WebService.makeServiceCallHeader(url, params, $rootScope.POST, token);
                result.then(function (response) {
                    if (response.status == 200) {
                        WebService.showAlert("Child information updated successfully");
                        $location.path("/editProfile");
                    } else {
                        WebService.showAlert("Problem in updating Child information");
                    }
                }, function (response) {
                    WebService.showAlert('' + JSON.stringify(response));
                });
            }
        };
    });
};


function profileController($scope, $state, $http, EditChildService, $rootScope, $location, $ionicSlideBoxDelegate, profile) {
    $scope.profileList = [];
    $scope.slidePrevious = function () {
        $ionicSlideBoxDelegate.previous();
    }
    $scope.slideNext = function () {
        $ionicSlideBoxDelegate.next();
    }
    $scope.editChild = function (x) {
        EditChildService.addChildDetail(x);
        $location.path("/EditChild");
    };
    $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
    };
    $scope.editUserProfile = function () {
        $location.path("/editUserProfile");
    };

    profile.allDetailswithChild(window.localStorage['token']).success(function (data) {
        if (data.status == 200) {
            var str;
            var myList = [];
            $rootScope.parentInfo = data.data[0].parent;
            $scope.parentName = data.data[0].parent.username;
            $scope.parentAddress = data.data[0].parent.address;
            $scope.msgcount = data.data[2].messagcount;
            $scope.parentImage = data.data[0].parent.image;
            $scope.check = true;
            $scope.cdate = new Date();
            $ionicSlideBoxDelegate.enableSlide(true);
            $ionicSlideBoxDelegate.update();
            if (data.data[1].child != null) {
                $scope.check = true;
                for (var i = 0; i < data.data[1].child.length; i++) {
                    var assign = {};
                    assign.first_name = data.data[1].child[i].first_name;
                    assign.last_name = data.data[1].child[i].last_name;
                    assign.status = data.data[1].child[i].status;
                    assign.sdate = data.data[1].child[i].sdate;
                    // assign.stime = data.data[1].child[i].stime;
                    if (data.data[1].child[i].stime == 'N/A') {
                    // alert("if");
                        assign.stime = '';
                        assign.checkedOut = '';
                    } else {
                        // alert("else");
                        var str = data.data[1].child[i].stime.split("/");
                        var checkedIn = str[0];
                        var CheckedOut = str[1];
                        assign.stime = checkedIn;
                        assign.checkedOut = CheckedOut;
                    }

                    assign.asdate = data.data[1].child[i].asdate;
                    assign.image = data.data[1].child[i].image;
                    assign.id = data.data[1].child[i].id;
                    str = data.data[1].child[i].assesment_details.replace(/#|&|13|;|,|_/g, '')
                    assign.assesment_details = str;
                    myList.push(assign);
                }
                $scope.profileList = myList;


            } else {
                $scope.check = false;
            }
        } else {
            WebService.showAlert("Invalid request");
        }
    });
};

function messageController($scope, $http, $rootScope, $location, message,WebService) {
    // alert($location.search().MTYPE);
    type = $location.search().MTYPE;
    message.allMessage(window.localStorage['token'], type).success(function (data) {
        // alert(JSON.stringify(data.data.message));
        if (data.status == 200) {
            $scope.allmsg = data.data.message;
        } else {
            WebService.showAlert("No Messages Found ");
        }
    });

    $scope.favorite = function (msgcode, status) {
        message.favoriteMessage(window.localStorage['token'], msgcode, status).success(function (data) {
            if (data.success == 200) {
                $location.path("/myMessages");
                WebService.showAlert("Message Selected Successfully ");
            } else {
                WebService.showAlert("Error occur please try again !");
            }
        });
    };
};

function messageViewController($scope, $http, $rootScope, $location, message,WebService) {
    // alert($location.search().MID);
    // alert(JSON.stringify($scope));
    // $scope.class = "message-group-item-list";
    mid = $location.search().MID;
    // jQuery('.message-group-item-list').addClass('message-active');
    message.showMessage(window.localStorage['token'], mid).success(function (data) {
        // alert("Showing Messages");
        // alert(data.status);
        // alert(JSON.stringify(data.data.message));
        // angular.element("#AddactiveCSS").addClass('message-active');
        if (data.status == 200) {
            $scope.subject = data.data.message.subject;
            $scope.body = data.data.message.body;
            $scope.sent_by = data.data.message.sent_by;
            $scope.date = data.data.message.date;
            $scope.mid = mid;
        } else {
            WebService.showAlert("No Messages Found ");
        }
    });
    $scope.delete = function (mid, status) {
        message.deleteorfavoriteMessage(window.localStorage['token'], mid, status).success(function (data) {
            if (data.success == 200) {
                WebService.showAlert("Message Deleted Successfully ");
                $location.path("/myMessages");
            } else {
                WebService.showAlert("No Messages Found ");
            }
        });
    };

};

function newMsgController($scope, $http, $rootScope, $location, message) {
    $scope.files = [];
    $scope.file_changed = function (files) {
        $scope.$apply(function (scope) {
            var photofile = files[0];
            console.log(photofile);
            console.log(photofile.name);
            console.log(photofile.size);
            console.log(photofile.type);
            var reader = new FileReader();
            reader.onload = function (e) {

                object = {};
                object.filename = photofile.name;
                object.filetype = photofile.type;
                object.filesize = photofile.size;
                object.data = e.target.result;
                $scope.files.push(object);
            };
            reader.readAsDataURL(photofile);
        });
    };

    $scope.submit = function () {
        message.newMessage(window.localStorage['token'], $scope.subject, $scope.body, $scope.files)
            .success(function (data) {
                if (data.status == 200) {
                    $location.path("/myMessages");
                    WebService.showAlert("Message Successfully Sent");
                } else {
                    WebService.showAlert("Message sent falid ");
                    $location.path("/myMessages");
                }
            });

    };
};

function replyMsgController($scope, $http, $rootScope, WebService, $location, message) {
    $scope.subject = $location.search().SUB;
    mid = $location.search().MID;
    $scope.submit = function () {
        message.replyMessage(window.localStorage['token'], $scope.subject, $scope.body, mid).success(function (data) {
            if (data.status == '200') {
                WebService.showAlert("Message Successfully Sent");
                $location.path("/myMessages");
            } else {
                WebService.showAlert("Problem in message sending");
            }
        });

    };
};



 function replyMsgController($scope, $http, $rootScope, WebService, $location, message) {
    $scope.subject = $location.search().SUB;
    mid = $location.search().MID;
    $scope.submit = function () {
        message.replyMessage(window.localStorage['token'], $scope.subject, $scope.body, mid).success(function (data) {
            if (data.status == '200') {

                var device_token = window.localStorage['device_token'];
                    alert(device_token);

                var params = {
                    destination: device_token,
                    message: $scope.body
                };
                var url = 'http://mastersoftwaretechnologies.com:9006/api/v1/android';
                var headers = {
                    'Content-Type': 'application/json'
                };

                $http({
                    method: 'POST',
                    url: url,
                    data: params,
                    headers: headers
                }).success(function (data, status, header, config) {
                    WebService.showAlert("Device Id Registered Successfully");

                }).error(function (data, status, header, config) {
//		  	        	  alert(JSON.stringify(status)+"dataerror"+JSON.stringify(data));
                });


				//pushNotification = window.plugins.pushNotification;
				//window.onNotification = function(e) {
				//	console.log('notification received');
				//	switch (e.event) {
				//	case 'registered':
				//		if (e.regid.length > 0) {
				//			var device_token = e.regid;
				//			console.log(device_token);
				//			var params = {
				//					destination : device_token,
				//					message : $scope.body
				//	                };
				//	                var url = 'http://mastersoftwaretechnologies.com:9006/api/v1/android';
				//	                var headers = {'Content-Type': 'application/json'};
                //
				//	                $http({
                 //                       method: 'POST',
				//	  	                url: url,
                 //                       data: params,
				//	  	                headers: headers
				//	  	          }).success(function(data, status, header, config) {
				//	  	        	alert("Device Id Registered Successfully");
                //
				//	  	        }).error(function(data, status, header, config) {
				//	  	        	  alert(JSON.stringify(status)+"dataerror"+JSON.stringify(data));
				//	  	        });
                 //       }
				//		break;
				//	case 'message':
				//		alert('msg received');
				//		alert(JSON.stringify(e));
				//		var msgDetail=JSON.stringify(e);
				//		window.localStorage['myMessages'] = msgDetail;
				//		$location.path("/myMessages");
				//		alert("next");
				//		break;
                //
				//	case 'error':
				//		alert('error occured');
				//		break;
				//	}
				//};
				//window.errorHandler = function(error) {
				//	alert('an error occured');
				//}

				//pushNotification.register(onNotification, errorHandler, {
				//	'badge' : 'true',
				//	'sound' : 'true',
				//	'alert' : 'true',
				//	'senderID' : '496561169900',
				//	'ecb' : 'onNotification'
				//});



                WebService.showAlert("Message Successfully Sent");
                $location.path("/myMessages");
            } else {
                WebService.showAlert("Problem in message sending");
            }
        });

    };
};




function galleryController($scope, $http, $rootScope, $location, $ionicModal, profile) {
    profile.galleries(window.localStorage['token']).success(function (data) {
        if (data.status == 200) {
            $scope.gallery = data.data.gellary;
            // alert(JSON.stringify(data));
        }
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('partials/galleryView.html');
        }
        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };

    });

};




