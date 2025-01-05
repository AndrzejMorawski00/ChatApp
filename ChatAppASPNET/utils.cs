using ChatAppASPNET.DBContext.Entities;
using ChatAppASPNET.Models.API;

namespace ChatAppASPNET
{
    public class Utils
    {

        public static UserDataModel ToUserDataModel(UserData user)
        {
            var model = new UserDataModel
            {
                ID = user.ID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
            };
            return model;
        } 
    }
}
