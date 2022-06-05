

//mysql에서 테이블이라고 불리는것이 시퀄라이즈에선 모델로 불린다
module.exports = (sequelize, DataTypes) => {
    //사용자 정보를 저장할 모델 생성
    //model은 단수명을 사용
    const User = sequelize.define('User', {
        //id는 기본적으로 포함된다.
        email: {
            type: DataTypes.STRING(30),//STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME 등 사용가능
            allowNull: false, //필수
            unique: true, //고유값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false, //필수
        },
        password: {
            //비밀번호는 암호화를 할것이기 때문에 길이를 넉넉하게 주었다
            type: DataTypes.STRING(100),
            allowNull: false, //필수
        },
    }, {
        //한글저장을 위한 설정
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    //모델을 사용하기 위한 기본 형태
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);

        //다대다 관계 [좋아요]
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); //중간 테이블 이름을 정해줄수있다

        //다대다 관계 [팔로잉, 팔로워]
        //같은 모델간 다대다 관계가 존재할때 foreignKey를 입력해야 한다.
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowerId' });
    };
    return User;
}