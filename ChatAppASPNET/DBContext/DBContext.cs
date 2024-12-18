using ChatAppASPNET.DBContext.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace ChatAppASPNET.DBContext
{
    public class DBContext
    {
        public class AppDBContext : DbContext
        {
            public DbSet<UserData> UserData { get; set; }
            public DbSet<Password> Passwords { get; set; }

            public DbSet<UserProfile> Profiles { get; set; }


            public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<UserData>(entity =>
                {
                    entity.ToTable("UserData");
                    entity.HasKey(u => u.Id);
                    entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
                });


                modelBuilder.Entity<Password>(entity =>
                {
                    entity.ToTable("Password");
                    entity.HasKey(p => p.Id);
                    entity.Property(p => p.PasswordHash).IsRequired();
                    entity.Property(p => p.Salt).IsRequired();
                    entity.Property(p => p.HashingRounds).HasDefaultValue(12);
                    entity.Property(p => p.PasswordSetDate).IsRequired();
                });

                modelBuilder.Entity<UserProfile>(entity =>
                {
                    entity.ToTable("UserAdditionalData");

                    entity.HasKey(up => up.Id);

                    entity.Property(up => up.ProfileImage)
                          .HasColumnType("NVARCHAR(MAX)");

                    entity.Property(up => up.FirstName)
                          .IsRequired()
                          .HasMaxLength(200);

                    entity.Property(up => up.LastName)
                          .IsRequired()
                          .HasMaxLength(200);

                    entity.HasOne(up => up.UserData)
                          .WithMany()
                          .HasForeignKey(up => up.UserId)
                          .IsRequired();
                });

            }

        }
    }
}