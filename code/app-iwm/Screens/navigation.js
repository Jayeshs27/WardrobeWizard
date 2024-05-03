

class navigationOps{
    static goToCamera(navigation){
        return (
            navigation.navigate('Camera')
        )
    };

    static goToProfile(navigation){
        return (
            navigation.navigate('UserProfile')
        )
    };
    
    static goToHome(navigation){
        return (
            navigation.navigate('Home')
        )
    };

    static goToSignIn(navigation){
        return (
            navigation.navigate('SignIn')
        )
    };

    static goToSignUp(navigation){
        return (
            navigation.navigate('SignUp')
        )
    };

    static goToWardrobe(navigation){
        return (
            navigation.navigate('Wardrobe')
        )
    };
    
    static goToTrends(navigation){
        return (
            navigation.navigate('Trends')
        )
    };
    
    static goToRecommendations(navigation){
        return (
            navigation.navigate('Recommendations')
        )
    };

    static goToChangePassword(navigation){
        return (
            navigation.navigate('ChangePassword')
        )
    };
}


export default navigationOps;