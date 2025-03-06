from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        dynamic_fields = kwargs.pop("fields", None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if dynamic_fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            # dynamic_fields - refers to a keyword argument passed when initializing the serializer
            allowed = set(dynamic_fields)
            # self.fields - represents all the fields defined in the serializer
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed("Invalid email or password. Please try again.")

        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "password2",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = get_user_model().objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["city", "state", "address", "phone_number", "avatar"]


class UserSerializer(DynamicFieldsModelSerializer):
    # profile = ProfileSerializer()
    city = serializers.CharField(source="profile.city")
    state = serializers.CharField(source="profile.state")
    address = serializers.CharField(source="profile.address")
    phone_number = serializers.CharField(source="profile.phone_number")
    avatar = serializers.CharField(source="profile.avatar")

    class Meta:
        model = get_user_model()
        fields = "__all__"
        # fields = [
        #     "id",
        #     "first_name",
        #     "last_name",
        #     "username",
        #     "email",
        #     "city",
        #     "state",
        #     "address",
        #     "phone_number",
        #     "avatar",
        #     # "profile",
        #     "role",
        #     "last_login",
        #     "is_active",
        #     "date_joined",
        # ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    @classmethod
    def get_nested_fields(cls):
        return ["id", "first_name", "last_name"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # self.fields is None - serializer includes all fields by default
        # only display the field if 'fields' is None or is explicitly included in 'fields' when initializing the serializer
        if self.fields is None or "role" in self.fields:
            # return the label of the choice instead of value.
            data["role"] = instance.get_role_display()
        return data
