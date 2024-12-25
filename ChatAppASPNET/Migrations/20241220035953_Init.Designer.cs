﻿// <auto-generated />
using System;
using ChatAppASPNET.DBContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ChatAppASPNET.Migrations
{
    [DbContext(typeof(AppDBContext))]
    [Migration("20241220035953_Init")]
    partial class Init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ChatAppASPNET.DBContext.Entities.Password", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<int>("HashingRounds")
                        .HasColumnType("int");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("PasswordSetDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("userID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("userID")
                        .IsUnique();

                    b.ToTable("Passwords");
                });

            modelBuilder.Entity("ChatAppASPNET.DBContext.Entities.UserData", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"));

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.ToTable("UserData");
                });

            modelBuilder.Entity("ChatAppASPNET.DBContext.Entities.Password", b =>
                {
                    b.HasOne("ChatAppASPNET.DBContext.Entities.UserData", "User")
                        .WithOne("Password")
                        .HasForeignKey("ChatAppASPNET.DBContext.Entities.Password", "userID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ChatAppASPNET.DBContext.Entities.UserData", b =>
                {
                    b.Navigation("Password")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
