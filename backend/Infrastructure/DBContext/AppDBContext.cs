using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DBContext
{
    public class AppDBContext : DbContext
    {
        public DbSet<UserData> UserData { get; set; }
        public DbSet<Password> Passwords { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatParticipant> ChatParticipants { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<SimpleMessage> SimpleMessages { get; set; }

        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserData>().ToTable("UserData");
            modelBuilder.Entity<Password>().ToTable("Passwords");
            modelBuilder.Entity<Friend>().ToTable("Friends");
            modelBuilder.Entity<Chat>().ToTable("Chats");
            modelBuilder.Entity<ChatParticipant>().ToTable("ChatParcitipants");
            modelBuilder.Entity<SimpleMessage>().ToTable("SimpleMessages");
            modelBuilder.Entity<Message>().ToTable("Messages");

            modelBuilder.Entity<Friend>()
                .HasOne(f => f.Sender)
                .WithMany(u => u.Friends)
                .HasForeignKey(f => f.SenderID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Password>()
                .HasOne(p => p.User)
                .WithOne(u => u.Password)
                .HasForeignKey<Password>(p => p.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Friend>()
                .HasOne(f => f.Receiver)
                .WithMany()
                .HasForeignKey(f => f.ReceiverID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatParticipant>()
                .HasOne(cp => cp.Chat)
                .WithMany(c => c.Participants)
                .HasForeignKey(cp => cp.ChatID);

            modelBuilder.Entity<ChatParticipant>()
                .HasOne(cp => cp.User)
                .WithMany(u => u.Participants)
                .HasForeignKey(cp => cp.UserID);


            modelBuilder.Entity<Message>()
                .HasOne(m => m.Chat)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ChatID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.SenderID)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
