using Firebase.Storage;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System.IO;
using System.Threading.Tasks;

namespace ntucoderbe.Infrastructure.Services
{
    public class FirebaseStorageService
    {
        private readonly string _bucket = "luvuphuc-firebase-790e8.appspot.com";

        public FirebaseStorageService()
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions
                {
                    Credential = GoogleCredential.FromFile("luvuphuc-firebase-790e8-firebase-adminsdk-axcoh-03ea884b0e.json"),
                    ProjectId = "luvuphuc-firebase-790e8"
                });
            }
        }

        public async Task<string> UploadImageAsync(string fileName, Stream imageStream)
        {
            var cancellationToken = new System.Threading.CancellationTokenSource();
            var task = new FirebaseStorage(
                _bucket,
                new FirebaseStorageOptions
                {
                    ThrowOnCancel = true
                })
                .Child("ntucoder")
                .Child(fileName)
                .PutAsync(imageStream, cancellationToken.Token);
            var downloadUrl = await task;
            return downloadUrl;
        }
        public async Task DeleteImageAsync(string imageUrl)
        {
            try
            {
                var uri = new Uri(imageUrl);

                var imagePath = Uri.UnescapeDataString(uri.AbsolutePath.Split(new[] { "/o/" }, StringSplitOptions.None)[1]);
                imagePath = imagePath.Split('?')[0];

                Console.WriteLine($"Deleting image: {imagePath}");

                var firebaseStorage = new FirebaseStorage("luvuphuc-firebase-790e8.appspot.com");
                await firebaseStorage.Child(imagePath).DeleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image: {ex.Message}");
                throw new InvalidOperationException("Error deleting image from Firebase Storage", ex);
            }
        }

    }
}
