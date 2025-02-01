const packageAdd = async ()=>{
    const users = await UserModel.find();
    for (const user of users) {
      await PackageModel.findOneAndUpdate({},{$push:{tier1:user._id}},{new:true});
    }
  }
  // packageAdd()


  /* GET home page. */
const generateUsers = async (numUsers) => {
    try {
      const users = [];
      for (let i = 0; i < numUsers; i++) {
        const user = new UserModel({
          username: "User "+ (i+1),
          investment: 25,
          currentSlotCount: 0,
          currentSlotType: 'CHILD',
          slots: [],
          totalIncome: 5,
          todayIncome: 5
        });
        users.push(user);
      }
      await UserModel.insertMany(users);
      console.log(`${numUsers} users generated successfully!`);
    } catch (error) {
      console.error('Error generating users:', error);
    }
  };
  // generateUsers(100000);
  
  const generatePackage = async (numUsers) => {
    try {
      const packages = [];
      for (let i = 0; i < numUsers; i++) {
        const package = new PackageModel({
          name:"Package "+(i+1),
          amount:(i+1)*25
        });
        packages.push(package);
      }
      await PackageModel.insertMany(packages);
      console.log(`${numUsers} users generated successfully!`);
    } catch (error) {
      console.error('Error generating users:', error);
    }
  };
  
  // generatePackage(8);